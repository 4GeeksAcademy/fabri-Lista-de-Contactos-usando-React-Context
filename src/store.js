export const initialStore = () => {
  return {
      contacts: []     
  };
};

export default function storeReducer (store, action ={}) {

  switch (action.type) {
    case "set_contacts":{
      const contactsFromAction = action.payload;

      return {
        ...store,
        contacts : contactsFromAction
      };
    }
    
    case "add_contact": {
      const newContact = action.payload;

      return {
        ...store,
        contacts: [...store.contacts, newContact]
      };
    }

    case "update_contact": {
      const updated = action.payload;

      return {
        ...store, 
        contacts: store.contacts.map(contact => contact.id === updated.id ? updated : contact ) 
      };
    }

    case "delete_contact" : {
      const idToDelete = action.payload;

      return{
        ...store,
        contacts: store.contacts.filter (contact => contact.id !== idToDelete)
      };
    }

    default : {
      throw new Error("Unknown action type:" + action.type);
    }
  }
};