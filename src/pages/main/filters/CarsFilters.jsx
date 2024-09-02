import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { useFormik } from "formik";

const CarFilters = ({ cars, applyFilters }) => {
  const brands = Array.from(new Set(cars.map((car) => car.brand)));
  const models = Array.from(new Set(cars.map((car) => car.model)));
  const years = Array.from({ length: 2025 - 1990 }, (_, i) => 1990 + i);
  const fuelTypes = ["Бензин", "Газ/Бензин", "Дизель", "Гібрид", "Електро"];
  const transmissions = ["Механічна", "Автоматична", "Типтронік"];
  const driveTypes = ["Передній", "Задній", "Повний"];
  const bodyTypes = [
    "Кабріолет",
    "Пікап",
    "Купе",
    "Універсал",
    "Седан",
    "Позашляховик/Кроссовер",
    "Хетчбек",
    "Мінівен",
  ];
  const colors = [
    "Чорний",
    "Білий",
    "Синій",
    "Сірий",
    "Зелений",
    "Жовтий",
    "Червоний",
    "Інший",
  ];
  const seatsOptions = ["2", "4", "5", "6", "7", "8 і більше"];

  const formik = useFormik({
    initialValues: {
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
    },
    onSubmit: (values) => {
      applyFilters(values);
    },
  });

  const filteredModels = formik.values.selectedBrand
  ? [...new Set(cars
      .filter((car) => car.brand === formik.values.selectedBrand)
      .map((car) => car.model)
    )]
  : models;


  const handleChange = (event) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value);
  };

  return (
    <Box sx={{ p: 2, border: "1px solid", borderRadius: 1 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
        Фільтри
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Марка</InputLabel>
              <Select
                name="selectedBrand"
                value={formik.values.selectedBrand}
                onChange={handleChange}
                label="Марка"
              >
                <MenuItem value="">Всі</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            {formik.values.selectedBrand && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Модель</InputLabel>
                <Select
                  name="selectedModel"
                  value={formik.values.selectedModel}
                  onChange={handleChange}
                  label="Модель"
                >
                  <MenuItem value="">Всі</MenuItem>
                  {filteredModels.map((model) => (
                    <MenuItem key={model} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={4.5}>
            <Typography variant="body1" style={{ margin: "5px" }}>
              Рік випуску
            </Typography>
          </Grid>
          <Grid item xs={4.5}>
            <Typography variant="body1" style={{ margin: "5px" }}>
              Ціна
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="body1" style={{ margin: "5px" }}>
              Об'єм двигуна
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>Від:</InputLabel>
              <Select
                name="yearFrom"
                value={formik.values.yearFrom}
                onChange={handleChange}
                label="Від"
              >
                <MenuItem value="">Всі</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={1.5}>
            <FormControl fullWidth>
              <InputLabel>До:</InputLabel>
              <Select
                name="yearTo"
                value={formik.values.yearTo}
                onChange={handleChange}
                label="До"
              >
                <MenuItem value="">Всі</MenuItem>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={1.5}></Grid>

          <Grid item xs={1.5}>
            <TextField
              fullWidth
              name="priceFrom"
              label="Від:"
              type="number"
              value={formik.values.priceFrom}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={1.5}>
            <TextField
              fullWidth
              name="priceTo"
              label="До:"
              type="number"
              value={formik.values.priceTo}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={1.5}></Grid>

          <Grid item xs={1.5}>
            <TextField
              fullWidth
              name="engineVolumeFrom"
              label="Від:"
              type="number"
              step="0.1"
              value={formik.values.engineVolumeFrom}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={1.5}>
            <TextField
              fullWidth
              name="engineVolumeTo"
              label="До:"
              type="number"
              step="0.1"
              value={formik.values.engineVolumeTo}
              onChange={formik.handleChange}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Коробка передач</InputLabel>
              <Select
                name="transmission"
                multiple
                value={formik.values.transmission}
                onChange={handleChange}
                input={<OutlinedInput label="Коробка передач" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {transmissions.map((transmission) => (
                  <MenuItem key={transmission} value={transmission}>
                    <Checkbox
                      checked={formik.values.transmission.includes(
                        transmission
                      )}
                    />
                    <ListItemText primary={transmission} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Вид палива</InputLabel>
              <Select
                name="fuelType"
                multiple
                value={formik.values.fuelType}
                onChange={handleChange}
                input={<OutlinedInput label="Вид палива" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {fuelTypes.map((fuelType) => (
                  <MenuItem key={fuelType} value={fuelType}>
                    <Checkbox
                      checked={formik.values.fuelType.includes(fuelType)}
                    />
                    <ListItemText primary={fuelType} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Кількість місць</InputLabel>
              <Select
                name="seats"
                multiple
                value={formik.values.seats}
                onChange={handleChange}
                input={<OutlinedInput label="Кількість місць" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {seatsOptions.map((seat) => (
                  <MenuItem key={seat} value={seat}>
                    <Checkbox checked={formik.values.seats.includes(seat)} />
                    <ListItemText primary={seat} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Тип приводу</InputLabel>
              <Select
                name="driveType"
                multiple
                value={formik.values.driveType}
                onChange={handleChange}
                input={<OutlinedInput label="Тип приводу" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {driveTypes.map((driveType) => (
                  <MenuItem key={driveType} value={driveType}>
                    <Checkbox
                      checked={formik.values.driveType.includes(driveType)}
                    />
                    <ListItemText primary={driveType} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Тип кузова</InputLabel>
              <Select
                name="bodyType"
                multiple
                value={formik.values.bodyType}
                onChange={handleChange}
                input={<OutlinedInput label="Тип кузова" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {bodyTypes.map((bodyType) => (
                  <MenuItem key={bodyType} value={bodyType}>
                    <Checkbox
                      checked={formik.values.bodyType.includes(bodyType)}
                    />
                    <ListItemText primary={bodyType} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Колір</InputLabel>
              <Select
                name="color"
                multiple
                value={formik.values.color}
                onChange={handleChange}
                input={<OutlinedInput label="Колір" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {colors.map((color) => (
                  <MenuItem key={color} value={color}>
                    <Checkbox checked={formik.values.color.includes(color)} />
                    <ListItemText primary={color} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Застосувати
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CarFilters;
