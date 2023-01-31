PROJECT_NAME=${1-"housiy-dev"}
ACR_NAME=${PROJECT_NAME//-/}

TAG="v$(date '+%Y%m%d%H%M%S')"

echo "Start deployment on $PWD"

WORK_PWD=$PWD

cd ..

for dir in ./*; do (cd "$dir" && rm -rf bin/ obj/ node_modules/ build/); done

cd $WORK_PWD

IMAGE="${PWD##*/}:${TAG}"

az acr build -t "${PROJECT_NAME}/${IMAGE}" --build-arg PAT=$PAT --registry "${ACR_NAME}acr" -f "./Dockerfile" ..

cat ./deploy.yml | sed s/"{ IMAGE }"/"${ACR_NAME}acr.azurecr.io\/${PROJECT_NAME}\/${IMAGE}"/g | kubectl apply -f -
