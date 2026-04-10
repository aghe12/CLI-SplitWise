import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

export interface AskOptions {
  defaultAnswer?: string | undefined;
  validator?: ((s: string) => string | true) | undefined;
}

export interface Choice {
  label: string;
  value: string;
}


export const openInteractionManager = () => {
  const rl = readline.createInterface({ 
    input, 
    output,
    terminal: false,
    prompt: ''
  });
  const ask:(question: string, options?: AskOptions)=>Promise<string|undefined> = async (question: string, options?: AskOptions) => {
    const { defaultAnswer, validator } = options || {};
    return new Promise((resolve) => {
      rl.question(
        question + `${defaultAnswer ? "(" + defaultAnswer + ")" : ""}`,
        (answer: string) => {
          if (validator) {
            const validationResult = validator(answer);
            if (validationResult !== true) {
              console.log(`Invalid: ${validationResult}`);
              resolve(ask(question, { defaultAnswer, validator }));
            }
          }
          resolve(answer || defaultAnswer);
        },
      );
    });
  };
  const choose:(question: string, choices: Choice[],optional?:boolean)=>Promise<Choice|undefined>=async (question: string, choices: Choice[],optional)=> {
    console.log(question);
    choices.forEach((choice) => {
      console.log(`${choice.value}. ${choice.label}`);
    });
    const choice = await ask("Please your choice:", {
      validator: (input) =>{
        if(optional && input.trim()=== ''){
          return true;
        }
        return choices.some((choice) => choice.value === input) ? true : "Please choose a valid option"},
    });
    return choices!.find(c=>c.value===choice)
  };

  const close = ()=>{
    rl.close();
  }
  return {
    ask,
    choose,
    close
  }
};

