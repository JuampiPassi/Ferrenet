const DBError = class BDError extends Error {
    constructor(message) {
      super(`Se produjo un error\nMENSAJE: ${message}`);
      this.name = this.constructor.name;
      this.data = { message };
      Error.captureStackTrace(this, this.constructor);
    }
  }


const handleErrores = (error) => {

    if(error.code){
        return new DBError(error.code);
    }else{

        if(error.level && error.gdscode && error.gdsparams){

            let gdsparams = error.gdsparams.join("-");
            let mens = `${error.level} - ${error.gdscode} - ${gdsparams}`;

            return new DBError(mens);

        }else{

        if(error.level && error.gdscode){

            return new DBError(error.level + ' - ' + error.gdscode);

        }else{

            if(error.level && error.gdsparams) {

                let gdsparams = error.gdsparams.join("-");
                let mens = `${error.level} - ${gdsparams}`;
                return new DBError(mens);

            }else{

                if(error.gdscode && error.gdsparams) {

                    let gdsparams = error.gdsparams.join("-");
                    let mens = `${error.gdscode} - ${gdsparams}`;
                    return new DBError(mens);

                }else{


                    if(error.level){

                        return new DBError(error.level);

                    }else{

                        if(error.gdscode){
                            return new DBError(error.gdscode);
                        }else{

                            if(error.gdsparams){

                                let gdsparams = error.gdsparams.join("-");
                                let mens = `${gdsparams}`;
                                return new DBError(mens);

                            }else{
                                console.error(error);
                                return new DBError(error);
                            }

                        }


                    }

                }

            }

        }

        }
    }

  }

module.exports = {
    handleErrores
}