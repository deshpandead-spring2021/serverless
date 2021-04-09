const AWS = require('aws-sdk');

var simpleemailservice = new AWS.SES({
    region: 'us-east-1'
});

var ses = new AWS.SES({ region: "us-east-1" });

const timetolive = 900;



var DynamoDocClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

var dynamodb = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
  
    console.log(event.Records[0].Sns.Message);
    
    
   var message = JSON.parse(event.Records[0].Sns.Message);
    console.log(message);
    
    

    var parameter = {
        Item: {
            'id': event.Records[0].Sns.MessageId,
          'EMAIL_ADDRESS': message.email_address,
          'BOOKD_ID': message.bookid,
          'TITLE': message.title,
          'AUTHOR': message.author,
          'ISBN':message.isbn,
          'LINK': message.link
        },
        TableName: "csye6225"
    };


    //function to put into dynamo db
    function putIntoDynamo() {
        return new Promise(function (resolve, reject) {
            DynamoDocClient.put(parameter, function (err, data) {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(data);
                }
            });
        });
    }
    

    async function putDynamoAsync(){
        var inserter = await putIntoDynamo();
    }
    
    

    
    //send email function
    function sendEmail(){
        
        var params = {
                Destination: {
                  ToAddresses: [message.email_address]
                },
                Message: {
                  Body: {
                      
                      Html: {
                            //Data: links
                            Data: '<html><head>' +
                                '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
                                '</head><body>' +
                                'Hello,' +
                                '<br><br>' +
                                'A user has posted a new book.' +
                                '<br><br>' +
                                'Below is the information of the posted book.' +
                                '<br>'+
                                '<br>' +
                                '<div>Email Address: </div>'+
                                '<div>'+ message.email_address +'</div>'+
                                '<br>' +
                                '<div>: </div>'+
                                '<div>'+ message.bookid +'</div>'+
                                '<br>' +
                                '<div> TITLE: </div>'+
                                '<div>'+ message.title+'</div>'+
                                '<br>' +
                                '<div> Author: </div>'+
                                '<div>'+ message.author+'</div>'+
                                '<br>' +
                                '<div> ISBN: </div>'+
                                '<div>'+ message.isbn+'</div>'+
                                '<div> Link: </div>'+
                                '<div>'+ 
                                '<a href=\''+message.link+'\'>'+message.link+'</a>'+'</div>'+
                                '<br><br>' +
                                'Regards' +
                                '<br><br>' +
                                'CSYE6225' +
                                '<br><br>' +
                                +'</body></html>'
                        }
                  },
            
                  Subject: { Data: "This is a notification message from WebApp running on AWS" },
                },
                Source: "webapp@prod.adityadeshpande.me",
              };
             
        
            return ses.sendEmail(params).promise()
        
    }
    

    
    //function to get from dynamo db
    function getFromDynamo(){
        
      var params = {
      ExpressionAttributeNames: {
       "#BID":  "BOOKD_ID",
       "#EM":  "EMAIL_ADDRESS",
       "#TIT":  "TITLE",
       "#AUTH": "AUTHOR",
       "#ISBN":"ISBN",
       '#LNK': "LINK"
      }, 
      ExpressionAttributeValues: {
       ":BOOK_ID": message.bookid,
       ":EMAIL_ADDRESS": message.email_address,
       ":TITLE": message.title,
       ":AUTHOR":message.author,
       ":ISBN":message.isbn,
       ":LINK": message.link
       
      }, 
      FilterExpression: "#BID = :BOOK_ID AND #EM = :EMAIL_ADDRESS AND #TIT = :TITLE AND #AUTH = :AUTHOR AND #ISBN= :ISBN AND #LNK = :LINK",
      ConsistentRead: true ,
      TableName: "csye6225"
     };
     
     DynamoDocClient.scan(params, function(err, data) {
       if (err) console.log(err, err.stack); // an error occurred
       else     {
           console.log(data.Count);
           console.log(data);
           console.log(message.link);
           if(data.Count == (0)){
               sendEmail();
               
           }
              }        // successful response
     });
    }
    
    
     async function getFromDynamoAsync(){
        var caller = await getFromDynamo();
    }
    
   
    
    //check for delete
    
    function checkForDelete(){
        if(message.title =="N/A" || message.link == "N/A" ){
           sendEmail();
           putDynamoAsync();
        }
        else{
            getFromDynamoAsync();
            putDynamoAsync();
            
        }
    }
    
    checkForDelete();
    
    

}