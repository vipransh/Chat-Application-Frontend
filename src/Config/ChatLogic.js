
export const getSender = (loggedUser,users) => {
    return users[0]._id === loggedUser.user?._id ? users[1].name : users[0].name;
  };


export const getSenderImage=(loggedUser,users)=>{
    return users[0]._id === loggedUser.user?._id ? users[1].profilePicture : users[0].profilePicture;
}  

export const getEmail=(loggedUser, users)=>{
  return users[0]._id === loggedUser.user?._id ? users[1].email : users[0].email;
}

