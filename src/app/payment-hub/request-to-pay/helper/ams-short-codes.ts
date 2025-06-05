import { environment } from "environments/environment";

export const amsShortCodes = (type: any = undefined) => {
    let amsCodes = environment.amsShortCodes;
    if(type){
        return amsCodes.filter(code => type === code.type);
    }
    return amsCodes;
};
