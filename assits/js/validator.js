 //tạo ra khuôn mẫu với form để dùng cho nhiều form khác 

function Validator(options) {
   var formElement = document.querySelector(options.form); 
  
  //xử lý trường hợp blur 
   function validate(inputElement,rule) { 
    var placeMessage = inputElement.nextElementSibling; 
    var errorMessage = rule.test(inputElement.value);
    if(errorMessage) {
       
        placeMessage.innerText = errorMessage;
        inputElement.parentElement.classList.add('invalid')
    }
    else{
        placeMessage.innerText = '';
        inputElement.parentElement.classList.remove('invalid')
    }
   }

   if(formElement) {
       //lấy ra các input Element trong form đc select
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector); 
           
            if(inputElement) {
                //xử lý trường hợp blur 
                inputElement.onblur = function () {
                    validate(inputElement,rule)
                    
                }
                //xử lý trường hợp oninput
                inputElement.oninput = function() {
                    var placeMessage = inputElement.nextElementSibling; 
                    placeMessage.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
   }
}
// nguyên tắc của các rules
//1. có lỗi trả về message
//2. hợp lệ thì k trả về tương đương với trả về undefined

//rule với input name
Validator.isRequired = function(selector) {
    return {
        selector,
        test : function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập thông tin';
        }
    }
}
//rule với input email
Validator.isEmail = function(selector) {
    return {
        selector,
        test : function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này không phải email'
        }
    }
}
//rule với input password
Validator.minLength = function (selector,min) {
    return {
        selector,
        test : function(value) {
           
            return value.length >=min ? undefined : `Mật khẩu phải chứa ít nhất ${min} kí tự`
        }
    }
}