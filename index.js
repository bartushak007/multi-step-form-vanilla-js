document.querySelectorAll(".resident-form__container").forEach(container => {
  const formSelector = container.querySelector(".resident-form__form");
  const progressBar = container.querySelector(".resident-form__progress-bar");
  const progBarPercent = container.querySelector(".resident-form__progress-bar-percent");
  const buttonNext = container.querySelector(".resident-form__button-next");
  const buttonPrev = container.querySelector(".resident-form__button-prev");
  const length = formSelector.children.length;
  const progressSteps = [0, 15, 35, 45, 75, 85, 90, 99, 100];
  const cardFields = [
    "js-birthdate",
    "js-gender",
    "js-english",
    "js-education",
    "js-incam",
    "js-birth",
    "js-live",
    "js-first",
    "js-last"
  ];
  const selectElementsArray = ["incam"];

  const isRadioChecked = (field) => {
    return Array.prototype.some.call(document.resident[field], (fieldElem) => {            
      return fieldElem.checked; 
    });  
  }

  // const isSelectChecked = (field) => {   
  //   return !!document.resident[field].value;    
  // }

  const formElemTypes = ['input', 'select'];

  let currentStep = 0;

  const toggleClassName = ({classList}) => (oldValue, newValue) => {
    classList.contains(oldValue) && classList.remove(oldValue);            
    classList.add(newValue);
  }

  const getAllFormElements = (formElementsArray, container) => {
    let formElements = [];

    formElementsArray.forEach(formElem => {
      formElements = formElements.concat(
        Array.prototype.map.call(
          container.querySelectorAll(formElem),
          elem => elem
        )
      );
    });
    return formElements;
  };

  const isValid = current => {
    const inputs = getAllFormElements(formElemTypes, current);

    return Array.prototype.every.call(inputs, input => {         
      return input.type === "radio" ? isRadioChecked(input.name) : input.type == "submit" ? true : !!input.value;
    });
  };

  const setProgressBar = currentStep => {
    !currentStep
      ? (progBarPercent.style.color = "#ff3737")
      : (progBarPercent.style.color = "#ffffff");
    progressBar.style.width = progressSteps[currentStep] + "%";
    progBarPercent.innerText = progressSteps[currentStep] + "%";
  };

  const nextStep = (func, positionLeft) => {
    formSelector.style.transform = `translateX(${func(
      parseFloat(positionLeft.length ? positionLeft.slice(11) : positionLeft)
    )}%)`;
  };

  const inputslistener = () => {
    getAllFormElements(formElemTypes, container).forEach(input => {
      // input.required = false;

      input.addEventListener("input", ({ target, target: { value } }) => {
        cardFields.forEach(selector => {
          const useToggleClassName = toggleClassName(container.querySelector('.card__gender-block'));
          const targetClassList = target.classList;

          if (target.classList.contains(`${selector}-input`)) { 
            const newValue = value
              ? value.charAt(0).toUpperCase() + value.slice(1)
              : "*****";

            targetClassList.contains('radio-female') && useToggleClassName('card__gender-block--male', 'card__gender-block--female');  
            targetClassList.contains('radio-male') && useToggleClassName('card__gender-block--female', 'card__gender-block--male');            

            container.querySelector(`.${selector}-text`).innerText = newValue;
          }            
        });
      });
    });
  };  

  inputslistener();

  buttonNext.addEventListener("click", () => {
    if (
      currentStep < length - 1 &&
      isValid(formSelector.children[currentStep])
    ) {
      nextStep(
        position => position - 100,
        container.querySelector(".resident-form__form").style.transform || 0
      );
      currentStep++;
      setProgressBar(currentStep);
    }
  });

  buttonPrev.addEventListener("click", () => {
    if (currentStep > 0) {
      nextStep(
        position => position + 100,
        container.querySelector(".resident-form__form").style.transform || 0
      );
      currentStep--;
      setProgressBar(currentStep);
    }
  });
});




document.querySelector('.form').addEventListener('submit', (e)=>{e.preventDefault(); console.log(e)})