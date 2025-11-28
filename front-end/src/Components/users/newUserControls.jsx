// ---- API
import { getByUserEmail, getUsernamePrefixList } from "../../service/apiUsers";

// *** CONTROLLI VALIDITA' DATI FORM REGISTRAZIONE UTENTE***
export default async function newUserControls(newUserdata) {
  
  const formData = new FormData();

  // ----> controllo campo nome vuoto
  const firstName = newUserdata.firstName;
  if (!firstName) {
    return {
      status: false,
      details: "firstName_error",
      message: "Inserisci il tuo nome",
    };
  }else{
    formData.append("firstName", firstName);
  }

    // ----> controllo campo cognoome vuoto
  const lastName = newUserdata.lastName;
  if (!lastName) {
    return {
      status: false,
      details: "lastName_error",
      message: "Inserisci il tuo cognome",
    };
  }else{
    formData.append("lastName", lastName);
  }

  // ---> controllo utente maggiore 16 anni <-----
  const today = new Date();
  const [year, month, day] = newUserdata.birthDate.split("-");
  const birthDate = new Date(year, month - 1, day);

  const userAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    userAge < 16 ||
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return {
      status: false,
      details: "birthDate_error",
      message: "Devi avere almeno 16 anni per poterti registrare !",
    };
  } else {
    formData.append("birthDate", newUserdata.birthDate);
  }

  // ---> controllo email <-----
  const email = newUserdata.email;

  if (!email.includes("@")) {
    return {
      status: false,
      details: "invalidEmail_error",
      message: "Inserisci una email valida",
    };
  }

  try {
    const emailResult = await getByUserEmail(email);
    if (emailResult.exist) {
      return {
        status: false,
        details: "existedEmail_error",
        message: "Questa email è già stata registrata",
      };
    } else {
      formData.append("email", newUserdata.email);
    }
  } catch (error) {
    console.error("search email error", error);
    return {
      status: false,
      details: "API_error",
      message:
        "Errore nella registrazione. Se il problema persiste contattare il Servizio Clienti",
    };
  }

  // ---> controllo password <-----
  const password1 = newUserdata.password1;
  const password2 = newUserdata.password2;

  const isValidPassword =
    password1.length >= 8 &&
    /[A-Z]/.test(password1) &&
    /[0-9]/.test(password1) &&
    /[^A-Za-z-0-9]/.test(password1);

  if (!isValidPassword) {
    return {
      status: false,
      details: "password_error",
      message: "La password non rispetta i criteri di sicurezza.",
    };
  }

  if (password1 === password2) {
    formData.append("password", newUserdata.password1);
  } else {
    return {
      status: false,
      details: "mismatch_error",
      message: "Le password non coincidono",
    };
  }


  //---> controllo userName <-----
  const newUsername = newUserdata.userName;

  try {
    const usernameList = await getUsernamePrefixList(newUsername);

    if (usernameList.length === 0) {
      // se non trova nessuna corrispondenza con stesso prefiso allora è valido
      formData.append("userName", newUsername);
    } else {
      // controlla se fra quelli con stesso prefisso ne esiste uno identico
      const existedUsername = usernameList.some(
        (user) => user.userName.toLowerCase() === newUsername.toLowerCase()
      );

      if (!existedUsername) {
        // se non esiste username identico allora è valido
        formData.append("userName", newUsername);
      } else {
        //se esite suggerisci primo username dispondibile (prefisso + numero)

        const srcNumber = newUsername.match(/(\d+)$/); //cerca gruppo di caratteri numerici alla fine
        const partName = srcNumber
          ? newUsername.slice(0, srcNumber.index)
          : newUsername;

        for (let i = 0; i <= usernameList.length; i++) {
          const suggest = partName + String(i + 1);
          const trySuggest = usernameList.some(
            (inLIst) => inLIst.userName.toLowerCase() === suggest.toLowerCase()
          );

          if (!trySuggest) {
            //se suggerimento non è presente allora è valido
            formData.append("userName", suggest);
            return {
              status: false,
              userName: suggest,
              details: "userName_error",
              message: "Username esistente ! Prova con " + suggest,
            };
          }
        }
      }
    }
  } catch (error) {
    console.error("search prefix users error", error);
    return {
      details: "API_error",
      message:
        "Errore nella registrazione. Se il problema persiste contattare il Servizio Clienti",
    };
  }

  
  // ---> controllo avatar <-----
  const avatar = newUserdata.avatar;
  if (!avatar) {
    // se campo vuoto
    formData.append(
      "avatar_url",
      "https://res.cloudinary.com/dvbmskxg4/image/upload/v1760776725/default_avatar_pac2qu"
    );
    formData.append("avatar_id", "default_avatar_pac2qu");
  } else {
    formData.append("avatar", avatar);
  }

  // ---> se non si è bloccato prima allora tutto ok <-----
  return {
    status: true,
    details: "successfull",
    message: "dati elaborati con successo e pronti all'invio",
    objectData: formData,
  };
}
