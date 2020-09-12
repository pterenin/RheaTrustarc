#!/bin/sh -x

# Update the RHEA_API_ENDPOINT
sed -i "s#{{RHEA_API_ENDPOINT}}#${RHEA_API_ENDPOINT:-rhea-develop}#" /etc/nginx/conf.d/default.conf
sed -i "s#{{FORCE_HTTPS}}#${FORCE_HTTPS:-false}#" /etc/nginx/conf.d/default.conf

# Inject the AAA hostname to use
AAA_HOST=${AAA_HOST:-"//aaa-dev.truste-svc.net"}
sed -i s/\{\{AAA_HOST\}\}/${AAA_HOST//\//\\/}/g /etc/nginx/conf.d/default.conf

cat /etc/nginx/conf.d/default.conf


# Once the server has started, run NGINX
echo "Starting Nginx..."
nginx-debug -g 'daemon off;'
