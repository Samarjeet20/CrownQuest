/* Game Initiation Handler Declarations */
const createNewGame = require("./handlers/gameInitHandler/createNewGame");
const joinGameBoard = require("./handlers/gameInitHandler/joinGameBoard");
const randomPlayGuest = require("./handlers/gameInitHandler/randomPlayGuest");
const randomPlayUser = require("./handlers/gameInitHandler/randomPlayUser");

/* Game Event Handler Declarations */
/*  -- Game Chat Handler Declarations */
const sendUserMessage = require("./handlers/gameEventHandler/gameChatHandler/sendUserMessage");
const userVideoHandler = require("./handlers/gameEventHandler/gameChatHandler/userVideoHandler");

/*  -- Game Draw Handler Declarations */
const acceptDraw = require("./handlers/gameEventHandler/gameDrawHandler/acceptDraw");
const offerDraw = require("./handlers/gameEventHandler/gameDrawHandler/offerDraw");
const rejectDraw = require("./handlers/gameEventHandler/gameDrawHandler/rejectDraw");

const onMovePiece = require("./handlers/gameEventHandler/onMovePiece");
const onDisconnect = require("./handlers/gameEventHandler/onDisconnect");
const onQuitGame = require("./handlers/gameEventHandler/onQuitGame");

/* Miscellaneous Declarations */
const onLobbyExit = require("./handlers/gameEventHandler/onLobbyExit");
const { sendAllGames } = require("./helpers/gameStatusHelper");
const { addUserToList } = require("./helpers/userManager");
const { emitUserError } = require("./helpers/errorHelper");
const {
  isUserAlreadyInGame,
  getGameWithGameId,
} = require("./helpers/gameBoardHelpers/playerManager");
const sendFriendRequest = require("./handlers/friendEventHandler/sendFriendRequest");
const respondFriendRequest = require("./handlers/friendEventHandler/respondFriendRequest");
const emitMyInfoToFriends = require("./helpers/friendEventHelpers/emitMyInfoToFriends");
const sendGameInviteToFriend = require("./handlers/friendEventHandler/sendGameInviteToFriend");
const acceptGameInviteToFriend = require("./handlers/friendEventHandler/acceptGameInviteToFriend");
const rejectGameInviteToFriend = require("./handlers/friendEventHandler/rejectGameInviteToFriend");

exports.SocketServer = (io) => {
  console.log("socket server has started running...");

  // on a new user socket connection
  io.on("connection", async (socket) => {
    console.log("a user connected! ID :- " + socket.id);
    socket.on("disconnect", onDisconnect({ io, socket }));

    /* ---------------------------------- Check For Multiple Devices ----------------------------------*/
    const addedUser = await addUserToList(socket, socket.handshake.query.token);
    if (addedUser === false) {
      console.log("User already online... disconnecting!!");
      emitUserError(
        socket,
        "Multiple Devices/tabs Detected!!",
        "Attention! you can connect 1 device only, close all other connections & retry!!",
        "Close",
        ""
      );
      socket.disconnect();
    } else if (!addedUser) {
      emitUserError(
        socket,
        "Invalid Credentials!!",
        "You existance is invalid!!",
        "Close",
        "/"
      );
    } else {
      if (!addedUser.isGuest) await emitMyInfoToFriends(io, socket, addedUser);
    }
    /* ---------------------------------- Check For Multiple Devices ----------------------------------*/

    /* ---------------------------------- Check For Existing Games ----------------------------------*/
    const existingGameID = await isUserAlreadyInGame(
      socket.handshake.query.token
    );
    if (existingGameID) {
      const game = getGameWithGameId(existingGameID);
      console.log("existing game found... sending to user...");
      socket.emit("ongoing-game", game);
    }
    /* ---------------------------------- Check For Existing Games----------------------------------*/