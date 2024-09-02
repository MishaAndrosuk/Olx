import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  Paper,
  Divider,
  IconButton,
  useTheme,
  Button
} from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useAction } from "../../hooks/useAction";


function AllCars() {
  const theme = useTheme();
  const cars = useSelector((state) => state.carsMainPageReducer.cars);
  const [userCars, setUserCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);

  const { deleteCar } = useAction();
  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const deleteUserCar = (id) => {
    const numberOfUserCars =
      parseInt(localStorage.getItem("numberOfUserCars")) || 0;
    const maxId =
      cars && cars.length > 0 ? Math.max(...cars.map((car) => car.id)) : 0;
    const minUserIdCar = maxId + 1;
    const maxUserIdCar=maxId+numberOfUserCars;
    if(minUserIdCar===id || maxUserIdCar===id){
        localStorage.removeItem(`car_${id}`)
    }
    else{
        for (let i = minUserIdCar; i <= maxUserIdCar; i++) {
            const car = JSON.parse(localStorage.getItem(`car_${i}`));
            if (car.id>id) {
                localStorage.setItem(`car_${car.id-1}`, JSON.stringify(car));
            }
        }
        localStorage.removeItem(`car_${maxUserIdCar}`)
    }

    localStorage.setItem("numberOfUserCars", numberOfUserCars-1)
    setSelectedCar(null);
    setUserCars(loadCarsFromLocalStorage());
  };

  const loadCarsFromLocalStorage = () => {
    const numberOfUserCars =
      parseInt(localStorage.getItem("numberOfUserCars")) || 0;
    const loadUserCars = [];
    let maxId =
      cars && cars.length > 0 ? Math.max(...cars.map((car) => car.id)) : 0;
    const maxIdCar = maxId + numberOfUserCars;

    for (let i = maxId + 1; i <= maxIdCar; i++) {
      const car = JSON.parse(localStorage.getItem(`car_${i}`));
      if (car) {
        loadUserCars.push(car);
      }
    }
    if(loadUserCars.length===0 && numberOfUserCars!=0){
        maxId-=numberOfUserCars;
        for (let i = maxId + 1; i <= maxIdCar; i++) {
            const car = JSON.parse(localStorage.getItem(`car_${i}`));
            if (car) {
                loadUserCars.push(car);
                deleteCar(car.id);
            }
          }
    }
    return loadUserCars;
  };

  useEffect(() => {
    const loadedUserCars = loadCarsFromLocalStorage();
    setUserCars(loadedUserCars);
  }, []);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item>
          <Grid container spacing={3}>
            <Grid item xs={5}>
              {userCars.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor={theme.palette.primary.main}
                  color={theme.palette.primary.contrastText}
                  p={5}
                  width={300}
                  borderRadius={2}
                >
                  <SearchOffIcon fontSize="large" />
                  <Typography variant="h6">Автомобілів немає!</Typography>
                </Box>
              ) : (
                userCars.map((car) => (
                  <Card
                    key={car.id}
                    onClick={() => handleCarClick(car)}
                    style={{ margin: "10px" }}
                  >
                    <CardActionArea>
                      <CardMedia
                        component="img"
                        image={car.photos[0]}
                        alt={`${car.brand} ${car.model}`}
                      />
                      <CardContent>
                        <Grid container justifyContent="space-between">
                          <Grid item>
                            <Typography variant="h5" component="div">
                              {car.brand} {car.model} {car.year}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="h5" color="text.primary">
                              {car.price}$
                            </Typography>
                          </Grid>
                        </Grid>
                        <Typography variant="body2" color="text.secondary">
                          {car.location} - {car.datePublication}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {car.mileage} тис.км
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))
              )}
            </Grid>

            <Grid item xs={7}>
              {selectedCar && (
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <CardMedia
                          component="img"
                          src={selectedCar.photos[0]}
                          alt={`${selectedCar.brand} ${selectedCar.model}`}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <CardMedia
                          component="img"
                          src={selectedCar.photos[1]}
                          alt={`${selectedCar.brand} ${selectedCar.model}`}
                        />
                      </Grid>
                    </Grid>
                    <Box mt={2}>
                      <Grid container justifyContent="space-between">
                        <Grid item>
                          <Typography
                            variant="h5"
                            component="div"
                            fontWeight="bold"
                          >
                            {selectedCar.brand} {selectedCar.model}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="h5"
                            color="text.primary"
                            fontWeight="bold"
                          >
                            {selectedCar.price}$
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box mt={2}>
                      <Grid container spacing={2}>
                        {[
                          {
                            label: "Модифікація",
                            value: selectedCar.modification,
                          },
                          { label: "Рік", value: selectedCar.year },
                          {
                            label: "Розмитнена",
                            value: selectedCar.customsCleared,
                          },
                          {
                            label: "Пробіг",
                            value: `${selectedCar.mileage} тис.км`,
                          },
                          { label: "Вид палива", value: selectedCar.fuelType },
                          {
                            label: "Об'єм двигуна",
                            value: `${selectedCar.engineVolume} л`,
                          },
                          { label: "Тип кузова", value: selectedCar.bodyType },
                          {
                            label: "Коробка передач",
                            value: selectedCar.transmission,
                          },
                          {
                            label: "Тип приводу",
                            value: selectedCar.driveType,
                          },
                          {
                            label: "Витрата палива",
                            value: `${selectedCar.fuelConsumption} л/100км`,
                          },
                          {
                            label: "Кількість місць",
                            value: selectedCar.numberSeats,
                          },
                          { label: "Колір", value: selectedCar.color },
                        ].map((item, index) => (
                          <Grid item xs={6} key={index}>
                            <Paper variant="outlined" sx={{ p: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item.label}: {item.value}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    <Box mt={2}>
                      {[
                        {
                          label: "Технічний стан",
                          value: selectedCar.technicalCondition,
                        },
                        { label: "Комфорт", value: selectedCar.comfort },
                        { label: "Мультимедіа", value: selectedCar.multimedia },
                        { label: "Безпека", value: selectedCar.security },
                      ].map((item, index) => (
                        <Paper
                          variant="outlined"
                          key={index}
                          sx={{ p: 1, mb: 1 }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {item.label}: {item.value}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                    <Divider />
                    <Box mt={2} style={{ margin: "10px" }}>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="bold"
                      >
                        Опис
                      </Typography>
                      <Typography variant="body1">
                        {selectedCar.description}
                      </Typography>
                    </Box>
                    <Divider />
                    <Grid container justifyContent="space-between">
                      <Box mt={2} style={{ margin: "10px" }}>
                        <Typography variant="h5" component="div">
                          {selectedCar.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedCar.datePublication}
                        </Typography>
                      </Box>
                      <Box mt={2} style={{ margin: "10px" }}>
                        <Typography variant="h5" component="div">
                          <IconButton>
                            <AccountIcon fontSize="medium" />
                          </IconButton>
                          {selectedCar.owner}
                        </Typography>
                        <Typography
                          variant="body1"
                          style={{ marginLeft: "15px" }}
                        >
                          {selectedCar.phone}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Button
                      color="primary"
                      variant="contained"
                      fullWidth
                      onClick={() => deleteUserCar(selectedCar.id)}
                      disabled={!selectedCar}
                    >
                      Видалити
                    </Button>
                  </Grid>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
export default AllCars;
