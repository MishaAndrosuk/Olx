export const addCars = (cars) => (dispatch) => {
  try {
    dispatch({ type: "ADD_CARS", payload: cars });
  } catch (error) {
    console.error("Add cars error: ", error);
  }
};

export const deleteCar = (id) => (dispatch) => {
  try {
    dispatch({ type: "DELETE_CAR", payload: id });
  } catch (error) {
    console.error("Delete car error: ", error);
  }
};
