import * as authActions from "../authReducer/action";
import * as themeActions from "../themingReducer/action";
import * as carsMainPageActions from "../carsMainPageReducer/action"

const actions = {
    ...authActions,
    ...themeActions,
    ...carsMainPageActions
};

export default actions;