
function Validator(selector,) {
    var _this = this;
  
    var formRules = {};
    var validatorRules = {
        required: function(value) {
            if(typeof value === 'string'){
                return value.trim() ? undefined : 'Vui lòng nhập trường này';
            }
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Trường này không phải email'
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`
            }
        }

        }
       
    
    var formElement = document.querySelector(selector);
    if(formElement){

        var inputs = formElement.querySelectorAll('[name][rule]')
        for(var input of inputs) {
           var rules = input.getAttribute('rule').split('|');
         
           for (var rule of rules) 
           {    var ruleFunc;
                var ruleInfo;
                var ruleHasColon = rule.includes(':');

              if(ruleHasColon)
                { 
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                    
                }
               
                 ruleFunc = validatorRules[rule];
                 // chạy hàm min trước để gán hàm lấy value input trong hàm min
                 // gán cho formRules[input.name]
                if(ruleHasColon)
                { 
                    
                    ruleFunc = ruleFunc(ruleInfo[1])
                }
              if(Array.isArray(formRules[input.name]))
                {
                    formRules[input.name].push(ruleFunc)
                }
                else 
                {
                    formRules[input.name] = [ruleFunc]
                }
           }
           // các sự kiện
           input.onblur = handleBlur;
           input.oninput = handleInput;
        } 
        //xử lý sự kiện onblur
        function handleBlur(e) {
           
            var rules = formRules[e.target.name];
            var formGroup  =  e.target.closest('.form-group');
            var placeMessage =formGroup.querySelector('.form-message')
            var errorMessage;
            rules.some(function(rule) {
             errorMessage = rule(e.target.value);
              return errorMessage
               
            })
            if(errorMessage){
                
               
                placeMessage.textContent = errorMessage;
                formGroup.classList.add('invalid');
            }
            else{
                placeMessage.textContent = '';
                formGroup.classList.remove('invalid')
            }
            return !errorMessage
          
        }
        // xử lý sự kiện oninput
        function handleInput(e) {
            var formGroup  =  e.target.closest('.form-group');
            var placeMessage =formGroup.querySelector('.form-message')
            placeMessage.innerText = '';
            formGroup.classList.remove('invalid');
        }
        //xử lý sự kiện onsubmit
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isValid = true;
            for(var input of inputs) {
               if( !handleBlur({ target : input}))
               {
                   isValid = false;
               }
        }
        if(isValid)
        {
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
       _this.onSubmit(data);
           
        }
    }
    
}

