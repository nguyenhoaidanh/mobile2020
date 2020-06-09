var nodemailer = require('nodemailer');
var db = require('./../helper/db')
var User = db.User;
var Token = db.Token;
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "bk.face.mobile@gmail.com",
    pass: "bachkhoa2020"
  }
});
module.exports ={
    send
}
async function send(req){
    var user  =  await User.findOne({gmail:req.body.email});    
    if(!user) throw {code:404,message:"Địa chỉ mail không tồn tại"};
    var token  = new Token();
    token.gmail=req.body.email;
    token.code=Math.floor(100000 + Math.random() * 900000).toString();
    console.log("token created");
    var mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: req.body.email,
        subject: 'BK Face: Khôi phục mật khẩu',
        text: 'Chúng tôi nhận được yêu cầu khôi phục mật khẩu, nếu là bạn vui lòng nhập mã xác thực để hoàn thành\n'+
        'Đây là mã xác thực: '+token.code+'\n'+
        'Chúc bạn một ngày tốt lành \nĐội ngũ BK Face'
      };
      
    transporter.sendMail(mailOptions, async function(error, info){
        if (error) {
          console.log(error);
          throw({code:500,message:"Lỗi server mail"})
        } else {
          await token.save();
          return ({mesage:"Mail đã được gửi tới hòm thư của bạn",object:info.response});
          console.log('Email sent: ' + info.response);
        }
      });
}
