import Cookies from 'universal-cookie';

const cookies = new Cookies();


export function authHeader(isMultiPart, newToken) {


  try {
    const Token = cookies.get('token');

    // console.log('----------------------');
    // console.log(Token);
    // console.log('----------------------');

    //'authorizationToken': `${Token}`,


    if (Token) {

      return {
        'Content-type': 'application/json',    
        'Authorization': `Bearer ${Token}`,
      };
    } else {
      return {
        'Content-type': 'application/json',
        'Authorization':'error',
      };
    }
  } catch (error) {
    return {
      'Content-type': 'application/json',
      'Authorization':'error',
    };
  }


}

