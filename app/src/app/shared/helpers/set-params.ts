
export class SetParams {
    public static setParams(obj:any) {
        Object.keys(obj).forEach((key) => {
            if ((obj[key] === null) || (obj[key] === undefined) || (obj[key] === '')) {
              delete obj[key];
            }
        });
      return obj;
    }
}
  
  