# Email API Failover

## Architecture

### Desired Architecture
* Cloudfront is scalable and faster to deliver frontend
* API gateway and lambda function is easy to maintain and deploy
* SQS and CloudWatch schedule is for failover and retry
![Desired Architecture](/images/desired-architecture.jpg)

### Current State
Different to desired architecture due to time constraint
![Current State](/images/current-state.jpg)

### Current Send Email Logic
![Send Email Logic](/images/send-email-logic.jpg)

## TODO
* UI to send email
* Cloudfront for frontend
* SQS for failover and retry
* Better validation on email address (allow email to accept alias)
* Better handling on timeout error

## Deployment
### Install
install serverless
```
npm install --save serverless
```

install packages
```
npm install
```

### Test
```
npm test
```

### Deploy

setup AWS credentials
```
export AWS_ACCESS_KEY_ID=<aws_access_key_id>
export AWS_SECRET_ACCESS_KEY=<aws_secret_key>
```

Create config.json in the root folder, the format of the file should look like following
```
{
  "<stage>": {
    "mailgun": {
      "domain": "<mailgun_domain>",
      "apiKey": "<mailgun_apikey>",
      "sender": "<mailgun_sender>"
    },
    "sendgrid": {
      "apiKey": "<sendgrid_apikey>",
      "sender": "<mailgun_sender>"
    }
  }
}

```

### Build
```
npm run build
```

### Deploy
```
serverless deploy --stage <stage> --region <region>
```

### How to use
POST API endpoint with the following json payload
```
{
	"to": ["<email>"],
  "cc": ["<email>"],  // optional
  "bcc": ["<email>"], // optional
	"subject": "test",
	"message": "test message"
}
```


## Caveats
* It looks like sendgrid requires domain verification for the sender, except test@email.com
* Make sure to check your spam inbox while testing
* Need to make sure all receipients are authorized in mailgun if you are using sandbox mode