find . -type f -regex "\./[a-z]+/[a-zA-Z_]+\.js" -print0 | xargs -0 jslint
