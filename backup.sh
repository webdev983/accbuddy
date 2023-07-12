
cd /home/user/Documents/git
filename="accbuddy_$(date -u +%Y%m%dT%H%M%SZ)"
zip -r $filename.zip accbuddy -x "*/node_modules/*"
aws s3 cp $filename.zip s3://files983/
rm $filename.zip


