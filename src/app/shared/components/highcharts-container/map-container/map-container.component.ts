import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { mapChart } from 'highcharts/highmaps';
import { MapDataRelationship, WorldMapService } from './world-map.service';
import { Subscription, throwError } from 'rxjs';
import { AutoUnsubscribe } from 'src/app/shared/decorators/auto-unsubscribe/auto-unsubscribe.decorator.js';
import mapFactory from 'highcharts/modules/map';
import { GeoJsonObject } from 'geojson';
import { MapProperties, MapUtilityService } from './map-utility.service';
import { Entity, MultiEntity } from '../highcharts-container.component';
import { PlottingService } from './plotting.service';

mapFactory(Highcharts);
@AutoUnsubscribe(['_getGeoRef$'])
@Component({
  selector: 'ta-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  public highcharts: any;
  public Entities = Object.keys(Entity).map(key => ({
    type: key,
    value: Entity[key]
  }));

  public multiEntity = MultiEntity;

  private seriesData: any[];
  private chart;
  private needUpdatePoints;

  private mapProperties: MapProperties = {
    xOffset: undefined,
    yOffset: undefined,
    xMargin: undefined,
    yMargin: undefined,
    jsonRes: undefined,
    crs: undefined,
    scale: undefined
  };
  private _getGeoRef$: Subscription;
  private _loadlatLonTableEvent$: Subscription;
  private _convertCountryCodeEvent$: Subscription;

  public constructor(
    private worldMapService: WorldMapService,
    private mapUtilService: MapUtilityService,
    private plottingService: PlottingService
  ) {
    worldMapService.getMapCoordinateTranslations();
  }

  public ngOnInit() {
    this.seriesData = [];
    this.highcharts = Highcharts;
    this.chart = this.createChart();
    this.chart.showLoading();
  }

  public ngAfterViewInit() {
    this._loadlatLonTableEvent$ = this.worldMapService.loadlatLonTableEvent$.subscribe(
      tables => {
        if (this.needUpdatePoints) {
          this.needUpdatePoints[2] = tables;

          this.updatePoints(this.needUpdatePoints);
          this.chart = this.createChart();

          this.needUpdatePoints = null;
        }
      }
    );

    this._convertCountryCodeEvent$ = this.worldMapService.convertCountryCodeEvent$.subscribe(
      country => {
        console.log('Missing coutry', country);
      }
    );
    this.initMap();
  }

  private initMap() {
    if (this._getGeoRef$) {
      this._getGeoRef$.unsubscribe();
    }

    this._getGeoRef$ = this.worldMapService.getMapAndData().subscribe(
      geo => {
        const mapData: GeoJsonObject = geo[0];

        this.chart.destroy();
        this.seriesData = [];

        this.addBaseMapToChart(mapData);
        this.initializeMapProperties(mapData);
        // Only "Update points" when MapCoordinateTranslations was loaded
        // In the case MapCoordinateTranslations is not yet completed load
        // need add flag to "Update Points" after MapCoordinateTranslations loaded
        if (this.worldMapService.latLonTable) {
          this.updatePoints(geo);
        } else {
          this.needUpdatePoints = geo;
        }
        this.chart = this.createChart();
      },
      err => throwError(err)
    );
  }

  private updatePoints(geo) {
    geo[1].data = this.updatePointsWithLatLons(geo[1].data);
    const pointData: Array<MapDataRelationship> = this.plottingService.prepareRelationshipDataForRendering(
      geo[1].data,
      this.mapProperties
    );
    this.addRelationshipsToMap(pointData);
  }

  public ngOnDestroy() {
    if (this._convertCountryCodeEvent$) {
      this._convertCountryCodeEvent$.unsubscribe();
    }
    if (this._loadlatLonTableEvent$) {
      this._loadlatLonTableEvent$.unsubscribe();
    }
  }

  /**
   * Mutates the given data with lat lons. Takes country codes and converts them.
   * @param data - data containing relationship information between entities (from and to points)
   * @returns The data updated with latitudes and longitudes.
   */
  private updatePointsWithLatLons(data: Array<MapDataRelationship>) {
    data.forEach((relationship, index) => {
      relationship.from.coordinates = this.worldMapService.convertCountryCodeToLocation(
        relationship.from.location,
        relationship.from.stateOrProvince
      );
      if (relationship.to) {
        relationship.to.coordinates = this.worldMapService.convertCountryCodeToLocation(
          relationship.to.location,
          relationship.from.stateOrProvince
        );
        // if to has invalid coordinates, ignore the edge for rendering
        if (
          !relationship.to.coordinates ||
          !relationship.to.coordinates.lat ||
          !relationship.to.coordinates.lon
        ) {
          relationship.to = undefined;
        }
      }
    });
    data = data.filter(
      relationship =>
        // From: if from exists and any of coordinates, lat, lon being null or undefined,
        //       filter it out so that it will not be rendered.
        !(
          relationship.from &&
          (!relationship.from.coordinates ||
            !relationship.from.coordinates.lat ||
            !relationship.from.coordinates.lon)
        )
    );
    return data;
  }

  /**
   * Initializes map properties
   * @param mapData - Data from the base-map GeoJsonObject
   */
  private initializeMapProperties(mapData: GeoJsonObject) {
    this.mapProperties.xOffset = mapData['hc-transform'].default.xoffset;
    this.mapProperties.yOffset = mapData['hc-transform'].default.yoffset;
    this.mapProperties.xMargin = mapData['hc-transform'].default.jsonmarginX;
    this.mapProperties.yMargin = mapData['hc-transform'].default.jsonmarginY;
    this.mapProperties.jsonRes = mapData['hc-transform'].default.jsonres;
    this.mapProperties.crs = mapData['hc-transform'].default.crs;
    this.mapProperties.scale = mapData['hc-transform'].default.scale;
  }

  /**
   * Creates the chart
   * @returns the chart to be rendered to
   */
  private createChart(): Highcharts.Chart {
    return mapChart('mapChartContainer', {
      credits: {
        enabled: false
      },
      title: {
        text: null
      },
      subtitle: {
        text: null
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
      legend: {
        enabled: true,
        squareSymbol: true,
        symbolPadding: 3,
        itemDistance: 10,
        symbolHeight: 7,
        x: 14
      },
      loading: {
        style: {
          fontSize: '150%'
        }
      },
      plotOptions: {
        mappoint: {
          states: {
            hover: {
              enabled: false
            }
          },
          marker: {
            enabled: true,
            symbol: 'circle',
            radius: 7
          },
          dataLabels: {
            formatter: function() {
              let label: string = this.point.name;
              if (label.length > 25) {
                label = label.substring(0, 25) + '...';
              }
              return label;
            }
          }
        },
        mapline: {
          states: {
            hover: {
              enabled: false
            }
          }
        },
        line: {
          states: {
            hover: {
              enabled: false
            }
          },
          allowPointSelect: false,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 0
          }
        },
        scatter: {
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 0
          },
          states: {
            hover: {
              enabled: false
            }
          }
        }
      },
      tooltip: {
        enabled: false
      },
      series: this.seriesData
    });
  }

  /**
   * Gets renderer defaults
   * @returns A set of default properties for rendering points, paths, and lines.
   */
  private getRendererDefaults() {
    return {
      pathDefaults: {
        type: 'mapline',
        lineWidth: 4,
        pointRadius: 12,
        showInLegend: false,
        lineOpacity: '88',
        pointOpacity: 'FF',
        pathOpacity: '88'
      },
      directionDefaults: {
        lineWidth: 1,
        type: 'scatter',
        color: '#000000',
        showInLegend: false
      },
      pointDefaults: {
        type: 'mappoint',
        lineWidth: 0,
        pointRadius: 12,
        showInLegend: false,
        lineOpacity: '88',
        pointOpacity: 'FF'
      }
    };
  }

  /**
   * Adds base map to series and removes the series from the legend.
   * @param mapData: data containing all of the country coordinates. This is needed to render the countries.
   */
  private addBaseMapToChart(mapData): void {
    this.seriesData.push({
      mapData: mapData as any,
      showInLegend: false
    });
  }

  /**
   * Adds relationships to map - Renders points and lines to map from the series data.
   * @param seriesData: Data containing the points and lines to be rendered.
   */
  private addRelationshipsToMap(seriesData: Array<MapDataRelationship>): void {
    const defaults = this.getRendererDefaults();
    seriesData.map((pointRelationship: MapDataRelationship): void => {
      this.renderSingleRelationship(pointRelationship, defaults);
    });
  }

  private renderSingleRelationship(
    pointRelationship: MapDataRelationship,
    defaults
  ) {
    const data = this.plottingService.calculateRelationshipData(
      pointRelationship
    );

    /* Draw a path between two points. */
    if (pointRelationship.needsLineRender) {
      this.seriesData.push({
        type: defaults.pathDefaults.type,
        lineWidth: defaults.pathDefaults.lineWidth,
        lineColor:
          pointRelationship.from.lineColor + defaults.pointDefaults.lineOpacity,
        color:
          pointRelationship.from.lineColor + defaults.pathDefaults.pathOpacity,
        showInLegend: defaults.pathDefaults.showInLegend,
        data: data.slice(0, 2)
      });
    }

    /* Add points */
    this.seriesData.push({
      type: defaults.pointDefaults.type,
      lineWidth: defaults.pointDefaults.lineWidth,
      color:
        pointRelationship.from.pointColor + defaults.pointDefaults.pointOpacity,
      showInLegend: defaults.pointDefaults.showInLegend,
      data: data.slice(0, 1)
    });

    /* Add directional arrows */
    if (pointRelationship.needsLineRender) {
      this.addDirectionalArrows(pointRelationship, defaults.directionDefaults);
    }
  }

  /**
   * Adds directional arrows - Arrows are calculated by finding midpoint of two points and then drawing two lines from the midpoint.
   * @param pointRelationship: from and to points with x and y coordinates for each so that we can use them to draw our directional arrow.
   * @param directionDefaults: default values for the series data for the arrows.
   */
  private addDirectionalArrows(
    pointRelationship: MapDataRelationship,
    directionDefaults
  ): void {
    /* Draw an arrow on one leg of the paths connecting two points */
    this.seriesData.push({
      type: directionDefaults.type,
      lineWidth: directionDefaults.lineWidth,
      showInLegend: false,
      color: directionDefaults.color,
      plotOptions: { selectable: false },
      data: this.mapUtilService.createDirectionalArrowData(
        pointRelationship.from,
        pointRelationship.to,
        pointRelationship.alternatePathToLocation
      )
    });
  }
}
