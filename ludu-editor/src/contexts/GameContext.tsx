import React, { createContext, Dispatch, SetStateAction } from "react";

import * as ld from "ludu-engine";

interface GameContextType {
	app: ld.Application | null;
	setApp: Dispatch<SetStateAction<ld.Application | null>>;
}

const GameContext = createContext<GameContextType | null>(null);

export default GameContext;
