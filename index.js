document.querySelectorAll(".resident-form__container").forEach(container => {
  const formSelector = container.querySelector(".resident-form__form");
  const progressBar = container.querySelector(".resident-form__progress-bar");
  const progBarPercent = container.querySelector(
    ".resident-form__progress-bar-percent"
  );
  const buttonNext = container.querySelectorAll(".resident-form__button-next");
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
    "js-last",
    "js-been",
    "js-phonecode",
    "js-phone",
    "js-email"
  ];

  const errors = {
    firstName: "Enter first name",
    lastName: "Enter last name",
    date: "Enter you birth date"
  };

  const selectElementsArray = [
    "js-education-input",
    "js-birth-input",
    "js-incam-input",
    "js-phonecode-input"
  ];

  const isRadioChecked = field => {
    return Array.prototype.some.call(document.resident[field], fieldElem => {
      return fieldElem.checked;
    });
  };

  const formElemTypes = ["input", "select"];

  let currentStep = 0;

  const toggleClassName = ({ classList }) => (oldValue, newValue) => {
    classList.contains(oldValue) && classList.remove(oldValue);
    classList.add(newValue);
  };

  /**
   * призначення функції
   * @param {*} formElementsArray
   * @param {*} container
   *
   * return-
   */
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

  const addErrorSpan = (condition, container, errorText) => {
    if (condition) {
      const addErrorElem = document.createElement("span");
      addErrorElem.classList.add("error-elem");
      addErrorElem.innerText = errorText;
      container.appendChild(addErrorElem);
    }
  };

  const removeElementHtml = (container, element) => {
    container.querySelector(element) &&
      container.removeChild(container.querySelector(element));
  };

  const addError = input => {
    if (input.type === "radio" && !isRadioChecked(input.name)) {
      input.parentNode.classList.add("error");
    } else if (input.type === "radio" && isRadioChecked(input.name)) {
      input.parentNode.classList.contains("error") &&
        input.parentNode.classList.remove("error");
    }

    if (
      !(input.type === "radio"
        ? isRadioChecked(input.name)
        : input.type == "submit"
        ? true
        : !!input.value)
    ) {
      input.classList.add("error");
      addErrorSpan(
        input.type !== "radio" &&
          !input.parentNode.querySelector(".error-elem"),
        input.parentNode,
        errors[input.name] || "fill field"
      );
    } else {
      input.classList.contains("error") && input.classList.remove("error");
      removeElementHtml(input.parentNode, ".error-elem");
    }
  };

  const showErrors = inputs => {
    Array.prototype.forEach.call(inputs, input => addError(input));
  };

  const isValid = current => {
    const inputs = getAllFormElements(formElemTypes, current);

    showErrors(inputs);
    return Array.prototype.every.call(inputs, input => {
      const result =
        input.type === "radio"
          ? isRadioChecked(input.name)
          : input.type == "submit"
          ? true
          : !!input.value;

      return result;
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

  const capitalize = value =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "*****";

  const getSelectOptionText = (arraySelectElems, classList, options, value) => {
    return arraySelectElems.some(selectElem => classList.contains(selectElem))
      ? Array.prototype.find.call(options, option => option.value === value)
          .text
      : null;
  };

  const inputslistener = () => {
    getAllFormElements(formElemTypes, container).forEach(input => {
      // input.required = false;      

      input.addEventListener(
        "input",
        ({ target, target: { value, classList, options } }) => {
          cardFields.forEach(selector => {
            const useToggleClassName = toggleClassName(
              container.querySelector(".card__gender-block")
            );

            if (classList.contains(`${selector}-input`)) {
              const newValue = capitalize(
                getSelectOptionText(
                  selectElementsArray,
                  classList,
                  options,
                  value
                ) || value
              );

              addError(target);

              classList.contains("radio-female") &&
                useToggleClassName(
                  "card__gender-block--male",
                  "card__gender-block--female"
                );
              classList.contains("radio-male") &&
                useToggleClassName(
                  "card__gender-block--female",
                  "card__gender-block--male"
                );

              if (container.querySelector(`.${selector}-text`)) {
                container.querySelector(
                  `.${selector}-text`
                ).innerText = newValue;
              }
            }
          });
        }
      );
    });
  };

  inputslistener();

  buttonNext.forEach(btn => {
   
    btn.addEventListener("click", () => {
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
        console.log(currentStep);

        if( currentStep === 0 || currentStep === length-1) {
          container.querySelector('.js-button-next').classList.add('hidden');
        } else {
          console.log(45454545)
          removeElementHtml(container, "js-button-next");          
        }
      }
    })
  });

  buttonPrev.addEventListener("click", () => {
    if (currentStep > 0) {
      nextStep(
        position => position + 100,
        container.querySelector(".resident-form__form").style.transform || 0
      );
      currentStep--;
      setProgressBar(currentStep);

      if( currentStep === 0 || currentStep === length-1) {
        container.querySelector('.js-button-next').classList.add('hidden');
      } else {
        console.log(45454545)
        removeElementHtml(container, "js-button-next");          
      }
    }
  });

  // if( currentStep === 0 || currentStep === length-1) {
  //   container.querySelector('.js-button-next').classList.add('hidden');
  // } else {
  //   container.querySelector('.js-button-next').classList.contains('hidden') 
  //   && container.querySelector('.js-button-next').classList.remove('hidden')
  // }
});

document.querySelector(".form").addEventListener("submit", e => {
  e.preventDefault();
  console.log(e);
});
