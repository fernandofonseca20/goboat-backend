import aws from 'aws-sdk';

class StorageUtils {
  s3: aws.S3;

  bucketName: string;

  constructor() {
    this.s3 = new aws.S3();
    this.bucketName = 'mami-api';
  }

  async upload(file: any, path: string = 'default' ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileName = `${process.env.NODE_ENV}/${path}/${Date.now()}.${file.originalname.split('.').pop()}`;
      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
      };

      this.s3.upload(params, (error: Error) => {
        if (!error) {
          return resolve(`${process.env.BASEURL_API}/api/image?file=${fileName}`);
        }
        console.log(error);
        return reject(error);
      });
    });
  }

  async uploadImg(fileBase64: any, path: string = 'default', ContentType :string = 'image/png'): Promise<string> {
    return new Promise((resolve, reject) => {
      
      const fileBuffer = Buffer.from(fileBase64, 'base64')
      const fileName = `${process.env.NODE_ENV}/${path}/${Date.now()}.png`;

      const params = {
        Bucket: this.bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentEncoding: 'base64',
        ContentType: ContentType
      };

      this.s3.upload(params, (error: Error) => {
        if (!error) {
          return resolve(`${process.env.BASEURL_API}/api/image?file=${fileName}`);
        }
        console.log(error);
        return reject(error);
      });
    });
  }



  async getFile(key): Promise<{
    data: aws.S3.Body | WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>,
    mimetype: string,
    file: aws.S3.GetObjectOutput | aws.AWSError
  }> {
    return new Promise(async (resolve, reject) => {
      try {
        const file = await this.s3
          .getObject({ Bucket: this.bucketName, Key: key })
          .promise();
        if (file) {
          return resolve({
            data: file.Body,
            mimetype: file.ContentType,
            file: file
          });
        } else return reject();
      } catch (error) {
        return reject({ message: error.message });
      }
    });
  }

  async delete(file: any) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.bucketName,
        Key: file,
      };

      this.s3.deleteObject(params, (error: Error) => {
        if (!error) {
          resolve(true);
          return;
        }
        console.log(error);
        reject(error);
      });
    });
  }
}

export default new StorageUtils();
