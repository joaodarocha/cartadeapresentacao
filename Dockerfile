FROM pierrezemb/gostatic
CMD [ "-fallback", "index.html" ]
COPY ./dist/ /srv/http/
