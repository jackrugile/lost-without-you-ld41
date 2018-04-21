const gulp = require("gulp");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const config = require("../config");
const _ = require("lodash");
const glob = require("glob");

let manifest = [];
let uploaded = [];
let totalFiles = 0;
let s3;

/*
------------------------------------------
| deploy:void (-)
------------------------------------------ */
gulp.task("deploy-static-aws", gulp.series("dist", aws));

/*
------------------------------------------
| aws:stream (-)
|
| Deploy project to s3.
------------------------------------------ */
function aws(done){

  // Set the environment
  if( process.env.NODE_ENV == "production" ){
    env = config.aws.production;
  } else {
    env = config.aws.staging;
  }

  // Set the identity
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: env.identity
  });

  // For dev purposes only
  AWS.config.update({
    region: env.region
  });

  // S3
  s3 = new AWS.S3();

  // deploy
  generateManifest()
  .then( emptyBucket )
  .catch( (err) => {
    console.log(err);
  })
  .then( upload )
  .catch( (err) => {
    console.log(err);
  })
  .then( () => {

    // Complete the promise chain
    done();
    console.log("Prepping for cloudfront clear....");

    setTimeout( () => {
      // If production invalidate cloudfront
      if( process.env.NODE_ENV == "production" && env.cloudfrontID != "" ){
        let cloudfront = new AWS.CloudFront({apiVersion: '2017-03-25'});
        var params = {
          DistributionId: env.cloudfrontID,
          InvalidationBatch: {
            CallerReference: Math.random() + '',
            Paths: {
              Quantity: 1,
              Items: [
                '/*',
              ]
            }
          }
        };

        // Invalidate cloudfront
        cloudfront.createInvalidation(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
      }

      // Live message
      console.log("Site now live at: " + env.bucket + ".s3-website-" + env.region + ".amazonaws.com");
    },5500)
  });

}

/*
------------------------------------------
| emptyBucket:promise (-)
|
| Empty the bucket.
------------------------------------------ */
function emptyBucket(){
  return new Promise( (resolve, reject) => {
    let params = {
      Bucket: env.bucket,
      Prefix: ""
    };

    // Clear Everything out
    s3.listObjects(params, (err, data) => {
      if (err) console.log(err);

      params = {Bucket: env.bucket};
      params.Delete = {Objects:[]};

      data.Contents.forEach( (content) => {
        params.Delete.Objects.push({Key: content.Key});
      });

      s3.deleteObjects(params, (err, data) => {
        console.log("Bucket emptied!");
        resolve();
      });
    });

  });
}

/*
------------------------------------------
| generateManifest:void (-)
------------------------------------------ */
function generateManifest(){
  return Promise.resolve()
    .then( getTotalFiles )
    .then( () => {
      parseDir( config.dev );
    });
}

/*
------------------------------------------
| getTotalFiles:void (-)
------------------------------------------ */
function getTotalFiles() {
  return new Promise( (resolve, reject) => {
    glob( config.dev + "/**/*", (err, files) => {
      totalFiles = _.filter( files, (f) => {
        return path.extname(f) != "";
      }).length;
      resolve();
    });
  });
}

/*
------------------------------------------
| parseDir:void (-)
|
| Recursive function to go over files in directories.
------------------------------------------ */
function parseDir( dir ){
  return Promise.resolve().then( () => {

    // Read each directory
    fs.readdir( dir, (err, files) => {

      // Loop files
      _.each( files, (file) => {

        // Check if file is directory
        if( path.extname(file) == "" ){

          // Directory Path
          let dirPath = `${dir}/${file}`;

          // Search that directory
          parseDir( dirPath );
        } else {

          // File Path
          let filePath = `${dir}/${file}`;

          // Push into manifest
          manifest.push({
            dir: dir,
            path: filePath
          });
        }
      })
    })
  })
}

/*
------------------------------------------
| upload:void (-)
|
| Upload files.
------------------------------------------ */
function upload(){
  return new Promise( (resolve, reject) => {

    // Loop the manifest
    _.each( manifest, (fileObj) => {
      let dir = fileObj.dir;
      let file = fileObj.path;

      let params = {
        Bucket: env.bucket + dir.replace(config.dev, ""),
        Key: "",
        Body: "",
        ACL: "public-read",
        ContentType: mime.lookup(file)
      }

      let fileStream = fs.createReadStream(file);
      fileStream.on("error", (err) => { console.log("File Error", err); });

      file = file.replace(config.dev + "/", "");
      params.Body = fileStream;
      params.Key = path.basename(file);

      s3.upload (params, (err, data) => {
        if (err) {
          console.log("Error", err);
          reject();
        } if (data) {
          console.log("Upload Success", data.Location);
          uploaded.push(file);
          if( uploaded.length == totalFiles ){
            resolve();
          }
        }
      });
    });
  });
}
