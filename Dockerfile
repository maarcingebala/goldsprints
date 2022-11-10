FROM node:6 as install
RUN apt-get update && apt-get install -y python3-pip

FROM install as build
WORKDIR /src
COPY . .
RUN npm install && \
     npm run build
RUN npm cache clean && \
     rm -rf node_modules

FROM build as release
RUN pip3 install -r requirements.txt
RUN python3 manage.py migrate
EXPOSE 8000 
CMD ["python3", "manage.py", "runserver", "8000"]