FROM alpine/git:latest as git
WORKDIR /src
RUN git clone https://github.com/dagmanov/faza.git .

FROM node:6 as install
COPY --from=git /src /src
RUN apt-get update && apt-get install -yq python3-pip

FROM install as build
COPY --from=install /src /src
WORKDIR /src
RUN npm cache clean && \
     rm -rf node_modules
RUN   npm install && \
     npm run build

FROM build as gs
COPY --from=build /src .
RUN   pip3 install -r requirements.txt
RUN python3 manage.py migrate
EXPOSE 8000 
CMD ["python3", "manage.py", "runserver", "8000"]