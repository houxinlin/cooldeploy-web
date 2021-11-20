npm run build
cp -r dist/* /home/HouXinLin/project/java/CoolDeploy/src/main/resources/static/
cd /home/HouXinLin/project/java/CoolDeploy/
exec ./gradlew bootJar
