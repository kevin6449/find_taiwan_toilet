## Welcome to find taiwan toilet

This is Actions on Goolge find taiwan toilet project source code   

### How to use

dialogflow / find_toilet.zip  is DialogFlow project , you can import to you project 

find_wc folder is nodejs code for Cloud Run  

Cloud Shell command

#---Building using Cloud Build-----
gcloud config set project [project_name]

gcloud builds submit --tag gcr.io/[project_name]/[image_name]

gcloud container images list

docker run -d -p 8080:8080 gcr.io/[project_name]/[image_name]

gcloud beta run deploy --image gcr.io/[project_name]/[image_name]
