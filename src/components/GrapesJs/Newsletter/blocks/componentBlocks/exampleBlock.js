const exampleBlock = [
  {
    tagName: 'div',
    // use `content` for static strings, `components` string will be parsed
    // and transformed in Components
    components: `



<section class="form" style="max-height:800px">
  <div class='form-content'>
    <div class='form-bg'>
   <img data-gjs-type="image" draggable="true" height="20" width="94" src="https://aeocdn.azureedge.net/mediahandler/azure-emails-templates/production/shared/images/templates/shared/microsoft-2x.png" alt="Microsoft" title="Microsoft" id="imjz" class="logo-microsoft text-left">
  <h2 class='logo-header'>Sign In</h2>
  <form class="loginbox" autocomplete="off">
    <label class='login-label' for='Email'>Email</label>
    <input placeholder="" type="text" id="Email"></input>
   <label class='login-label' for='password'>Password</label>
    <input  placeholder="" style='margin-bottom: 0' type="password" id="password"></input>
<p class='forget-password'>Forget Password?</p>
<button id="submit" onclick="alert('clicked')">Sign In</button>
        </div>
</form>
<div class='d-flex login-seperator'><div></div><div>or</div><div></div></div>
<div class='create-account'>Create Account</div>
</div>
</section> <style>


 .form {
     background-image: linear-gradient(
120deg
,#d983a6,#4d114f);
 width:100%;
    display:flex;
   align-items:center;
   justify-content:center;
   height: 100vh;

}
.form-content{
   display:flex;

   justify-content:center;
  flex-flow: column;
    width:548px;
   padding: 40px;
}
 .form input {
 outline: none;
 display: block;
 width: 100%;
 margin: 0 0 20px;
 padding: 10px 15px;
 border: 1px solid #ccc;
 color: #ccc;
 box-sizing: border-box;
    background: #FFFFFF;
    border: 1px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 8px;
}
 .form inputinput:focus {
 color: #333;
 border: 1px solid #44c4e7;
}
 .form button {
 cursor: pointer;
 background: #44c4e7;
 width: 100%;
 padding: 10px 15px;
 border: 0;
 color: #fff;
 font-size: 14px;
 font-weight: 400;
}
 .form button:hover {
 background: #369cb8;
}
 .error, .valid {
 display: none;
}
.logo-header{
 font-family: Open Sans;
font-style: normal;
font-weight: normal;
font-size: 34px;
line-height: 39px;
color: #383B41;
}
.login-label{
 font-family: Open Sans;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 22px;
letter-spacing: 0px;
text-align: left;

}
.forget-password{
margin-top: 0px;
font-family: Open Sans;
font-size: 14px;
font-style: normal;
font-weight: 600;
line-height: 24px;
letter-spacing: 0px;
text-align: right;
margin-bottom: 40px;
  cursor:pointer;
}
#submit{
background: #2196F3;
box-shadow: 0px 2px 5px rgba(33, 150, 243, 0.3), 0px 0px 3px rgba(0, 0, 0, 0.1);
border-radius: 4px;
  font-family: Open Sans;
font-size: 14px;
font-style: normal;
font-weight: 600;
line-height: 24px;
letter-spacing: 0px;
text-align: center;
}
.login-seperator {
  display:flex;
  flex-flow:row;
  margin-top: 50px;
    color:#fff;
}
.login-seperator div:first-child{
width:100%;
height: 1px;
background:#fff;

  margin:10px 10px;
font-family: Open Sans;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 22px;
letter-spacing: 0px;
text-align: left;

}
.login-seperator div:last-child{
width:100%;
height: 1px;
background:#fff;
  margin:10px 20px;
font-family: Open Sans;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 22px;
letter-spacing: 0px;
text-align: left;

}
.form-bg{
    background: #fff;
     padding: 40px;
}

.create-account{
  width:100%;
  text-align:center;
    background: #fff;
  font-family: Open Sans;
font-size: 14px;
font-style: normal;
font-weight: 600;
line-height: 24px;
letter-spacing: 0px;
  margin-top: 30px;
  background: #FFFFFF;

border: 1px solid #383B41;
box-sizing: border-box;
border-radius: 4px;
  padding:4px;
  cursor:pointer;
}</style>`
  }
]
export default exampleBlock
