 //tạo ra khuôn mẫu với form để dùng cho nhiều form khác 

function Validator(options) {
    //tạo hàm lấy ra thẻ form-group 
    // function getParent(element, selector) {
    //     while(element.parentElement)
    //     {
    //         if(element.parentElement.matches(selector))
    //         {
    //             return element.parentElement;
    //         }
        
    //         element = element.parentElement;
    //     }
    // }
   var formElement = document.querySelector(options.form); 
   var ruleSelector = {};
   if(formElement) {
    formElement.onsubmit = function(e) {
        e.preventDefault();//bỏ đi hành vi mặc định khi submit form
        var isFormValid = false;
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector); 
            var isValid = validate(inputElement,rule)
            if(isValid){
                isFormValid = true;
            }
        })
        // lấy dữ liệu của các ô input khi nhập đúng 
        if(!isFormValid) {
           var enableInput = formElement.querySelectorAll('[name]:not([disabled])')
            var data = Array.from(enableInput).reduce(function(acc, item) {
                switch(item.type) {
                    
                    case 'radio':
                       if(item.checked)
                       {
                        acc[item.name] = item.value
                       }
                        break;
                    case 'checkbox':
                        if(item.checked)
                        {
                         if(Array.isArray(acc[item.name]))
                         {
                            acc[item.name].push(item.value)
                         }
                         else
                         {
                            acc[item.name] = [item.value];
                         }
                         
                        }
                        break;
                        case 'file':
                            acc[item.name] = item.files;
                            break;
                    default:
                        acc[item.name] = item.value
                }
                
                return  acc; 
            },{})
        }
       options.onsubmit(data);

    }
    }
    
  //xử lý  trường hợp blur 
   function validate(inputElement,rule) { 
  
    var placeMessage = inputElement.closest(options.formGroup).querySelector(options.errorSelector); 
    var errorMessage ;
    // lấy ra từng rule 
    var rules = ruleSelector[rule.selector]
    // duyệt qua từng test khi gặp phải lỗi đầu tiên thì 
    //break khỏi loop, xử lí với các loại input
    
    for (var i = 0; i < rules.length; i++) {
        switch(inputElement.type) {
            case 'radio':
            case 'checkbox':
                errorMessage = rules[i](
                    formElement.querySelector(rule.selector + ':checked')
                );
                break;
            default:
                errorMessage = rules[i](inputElement.value);
        }
        
        if(errorMessage) break;
    }
    // xử lí lỗi
    if(errorMessage) {
       
        placeMessage.innerText = errorMessage;
        inputElement.closest(options.formGroup).classList.add('invalid')
    }
    else{
        placeMessage.innerText = '';
        inputElement.closest(options.formGroup).classList.remove('invalid')
    }
    return !!errorMessage;
   }

   if(formElement) {
       //lấy ra các input Element trong form đc select
        options.rules.forEach(function(rule) {
            // lưu lại các rule cho mỗi input theo mảng
            //Ban đầu ruleSelector[rule.selector] là undefined nên sẽ
            //lọt vào else trước và đc gán bằng giá trị của rule.test là một mảng
            // khi đã là một mảng thì nếu lặp lại rule.selector sẽ đc push rule.test vào mảng
            if(Array.isArray( ruleSelector[rule.selector]))
            {
                ruleSelector[rule.selector].push(rule.test);
            }
            else
            {
                ruleSelector[rule.selector] = [rule.test];
            }
           
            var inputElements = formElement.querySelectorAll(rule.selector); 
            //chuyển từ Node List inputElements sang mảng để forEach
            Array.from(inputElements).forEach(function(inputElement) {
                if(inputElement) {
                    //xử lý trường hợp blur 
                    inputElement.onblur = function () {
                        validate(inputElement,rule)
                        
                    }
                    //xử lý trường hợp oninput
                    inputElement.oninput = function() {
                        var placeMessage = inputElement.closest(options.formGroup).querySelector(options.errorSelector); 
                        placeMessage.innerText = '';
                        inputElement.closest(options.formGroup).classList.remove('invalid')
                    }
                }
            })
           
            
        });
        
   }
}
// nguyên tắc của các rules
//1. có lỗi trả về message
//2. hợp lệ thì k trả về tương đương với trả về undefined

//rule với yêu cầu cần nhập vào input
Validator.isRequired = function(selector, message) {
    return {
        selector,
        test : function(value) {
            if(typeof value === 'string'){
                return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
            }
            return value ? undefined : message || 'Vui lòng nhập trường này';
        }
        }
    }

//rule với input email
Validator.isEmail = function(selector, message) {
    return {
        selector,
        test : function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này không phải email'
        }
    }
}
//rule với input password
Validator.minLength = function (selector,min,message) {
    return {
        selector,
        test : function(value) {
           
            return value.length >=min ? undefined : message || `Mật khẩu phải chứa ít nhất ${min} kí tự`
        }
    }
}
// rule với comfirm password
Validator.confirm = function(selector, confirmValue,message) {
    return {
        selector,
        test : function(value) {
           
            return value ===confirmValue() ? undefined : message || 'Giá trị không tương ứng';
        }
    }

}