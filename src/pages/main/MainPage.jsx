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
  Pagination,
  IconButton,
  useTheme,
} from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import CarFilters from "./filters/CarsFilters";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useAction } from "../../hooks/useAction";

const MainPage = () => {
  const theme = useTheme();
  const cars = useSelector((state) => state.carsMainPageReducer.cars);
  const [selectedCar, setSelectedCar] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    selectedBrand: "",
    selectedModel: "",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
    engineVolumeFrom: "",
    engineVolumeTo: "",
    transmission: [],
    fuelType: [],
    seats: [],
    driveType: [],
    bodyType: [],
    color: [],
  });
  const carsPerPage = 10;
  const { addCars } = useAction();

  const handleCarClick = (car) => {
    setSelectedCar(car);
  };

  const pageChangeHandler = (event, value) => {
    setSelectedCar(null);
    setCurrentPage(value);
  };

  const applyFilters = (newFilters) => {
    setSelectedCar(null);
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const loadCarsFromLocalStorage = () => {
    const numberOfUserCars =
      parseInt(localStorage.getItem("numberOfUserCars")) || 0;
    const userCars = [];
    const maxId =
      cars && cars.length > 0 ? Math.max(...cars.map((car) => car.id)) : 0;
    const maxIdCar = maxId + numberOfUserCars;

    for (let i = maxId + 1; i <= maxIdCar; i++) {
      const car = JSON.parse(localStorage.getItem(`car_${i}`));
      if (car) {
        userCars.push(car);
      }
    }

    return userCars;
  };

  useEffect(() => {
    const userCars = loadCarsFromLocalStorage();
    if (userCars.length > 0) {
      addCars(userCars);
    }
  }, []);

  const filterCars = (cars) => {
    return cars.filter((car) => {
      const {
        selectedBrand,
        selectedModel,
        yearFrom,
        yearTo,
        priceFrom,
        priceTo,
        engineVolumeFrom,
        engineVolumeTo,
        transmission,
        fuelType,
        seats,
        driveType,
        bodyType,
        color,
      } = filters;

      return (
        (!selectedBrand || car.brand === selectedBrand) &&
        (!selectedModel || car.model === selectedModel) &&
        (!yearFrom || car.year >= yearFrom) &&
        (!yearTo || car.year <= yearTo) &&
        (!priceFrom || car.price >= priceFrom) &&
        (!priceTo || car.price <= priceTo) &&
        (!engineVolumeFrom || car.engineVolume >= engineVolumeFrom) &&
        (!engineVolumeTo || car.engineVolume <= engineVolumeTo) &&
        (transmission.length === 0 ||
          transmission.includes(car.transmission)) &&
        (fuelType.length === 0 || fuelType.includes(car.fuelType)) &&
        (seats.length === 0 || seats.includes(String(car.numberSeats))) &&
        (driveType.length === 0 || driveType.includes(car.driveType)) &&
        (bodyType.length === 0 || bodyType.includes(car.bodyType)) &&
        (color.length === 0 || color.includes(car.color))
      );
    });
  };

  const filteredCars = filterCars(cars);
  const pageCount = Math.ceil(filteredCars.length / carsPerPage);
  const displayedCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage
  );

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item>
          <CarFilters cars={cars} applyFilters={applyFilters} />
        </Grid>
        <Grid item>
          <Grid container spacing={3}>
            <Grid item xs={5}>
              {displayedCars.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor={theme.palette.primary.main}
                  color={theme.palette.primary.contrastText}
                  p={3}
                  borderRadius={2}
                  width={1050}
                >
                  <SearchOffIcon fontSize="large" />
                  <Typography variant="h6">
                    Автомобілів з такими характеристиками не знайдено!
                  </Typography>
                </Box>
              ) : (
                displayedCars.map((car) => (
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
                  </CardContent>
                </Card>
              )}
            </Grid>
            <Grid item xs={12} sx={{ display: "flex" }}>
              <Pagination
                page={currentPage}
                onChange={pageChangeHandler}
                sx={{ m: "auto" }}
                count={pageCount}
                color="primary"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MainPage;
