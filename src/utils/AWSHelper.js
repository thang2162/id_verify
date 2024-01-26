import { PutObjectCommand, DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3"
import { AnalyzeIDCommand, TextractClient } from "@aws-sdk/client-textract";
import { CompareFacesCommand, RekognitionClient } from "@aws-sdk/client-rekognition";
import { AWS_ACCESS_KEY, AWS_SECRET_KEY } from "@env"
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { ReadableStream } from 'web-streams-polyfill/ponyfill';
globalThis.ReadableStream = ReadableStream;

const options = {
  keyPrefix: "uploads/",
  bucket: "idverifydemoducket",
  region: "us-east-2",
  successActionStatus: 201
}

let credentials = {
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
}
const s3Client = new S3Client({
  region: options.region,
  credentials: credentials
})

const rekognitionClient = new RekognitionClient({
  region: options.region,
  credentials: credentials
})

const textractClient = new TextractClient({
  region: options.region,
  credentials: credentials
})

const AWSHelper = {
  uploadFile: async function (path) {
    try {
      const pathSpl = path.split('/');
      const fileName = pathSpl[pathSpl.length - 1];
      const fileNameSpl = fileName.split('.')
      const file = {
        //uri:  `file://${path}`,
        uri: path,
        name: pathSpl[pathSpl.length - 1],
        type: 'image/*'
      }

      await s3Client.send(new PutObjectCommand({ Bucket: options.bucket, Key: file.name, Body: file, })).then(response => {
        console.log(response)
      }).catch((error) => { console.log(error) })
      return fileName
    } catch (error) {
      console.log(error);
    }
  },
  deleteFiles: async function (fileName, fileName2) {
    try {
      const params = {
        Bucket: options.bucket,
        Delete: {
          Objects: [{ Key: fileName }, { Key: fileName2 }],
        },
      };

      await s3Client.send(new DeleteObjectsCommand(params)).then(response => {
        console.log(response)
      }).catch((error) => { console.log(error) })
      return fileName
    } catch (error) {
      console.log(error);
    }
  },
  verifySelfie: function (idFileName, selfieFileName) {
   return new Promise(async resolve => {
    try {
      const params = {
        SourceImage: {
          S3Object: {
            Bucket: options.bucket,
            Name: idFileName
          },
        },
        TargetImage: {
          S3Object: {
            Bucket: options.bucket,
            Name: selfieFileName
          },
        },
        SimilarityThreshold: 70
      }

      await rekognitionClient.send(new CompareFacesCommand(params)).then(response => {
        console.log('verifySelfie', response)
        resolve(response)
      }).catch((error) => { console.log(error) })
    } catch (error) {
      console.log(error);
    }
   });
  },
  verifyId: function (idFileName) {
   return new Promise(async resolve => {
    try {
      const params = [
        {
          S3Object: {
            Bucket: options.bucket,
            Name: idFileName
          },
        }
      ]
      await textractClient.send(new AnalyzeIDCommand({ DocumentPages: params })).then(response => {
      console.log('verifyId', response)
      resolve(response);
    }).catch((error) => { console.log(error) })
    
  } catch(error) {
    console.log(error);
  }
   });
}, 
}

export default AWSHelper; 