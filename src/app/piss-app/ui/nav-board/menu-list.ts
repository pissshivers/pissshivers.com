import { store } from "../../../store"
import { loadScene, toggleHelpMenu } from "../../../store/scene/actions"
import { Backyard, Toilet, Graveyard } from "../../scenes"

export const MenuList = [
    {
        icon: "mouse.png",
        text: "Backyard",
        onClick: () => {
            store.dispatch(loadScene(Backyard.name))
        }
    },
    {
        icon: "mouse.png",
        text: "Toilet",
        onClick: () => {
            store.dispatch(loadScene(Toilet.name))
        }
    },
    {
        icon: "flashlight-on.png",
        text: "Graveyard",
        onClick: () => {
            store.dispatch(loadScene(Graveyard.name))
        }
    },
    {
        icon: "help.png",
        text: "Help",
        onClick: () => {
            store.dispatch(toggleHelpMenu(true))
        }
    }
]