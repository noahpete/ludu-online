import React, { createContext, Dispatch, SetStateAction } from "react";

import * as ld from "ludu-engine";

interface GameContextType {
	app: ld.Application | null;
	setApp: Dispatch<SetStateAction<ld.Application | null>>;
	selectedEntity: ld.Entity | null;
	setSelectedEntity: Dispatch<SetStateAction<ld.Entity | null>>;
}

const GameContext = createContext<GameContextType | null>(null);

export default GameContext;
