import React, { useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AddCar() {
  const navigate = useNavigate();
  const cars = useSelector((state) => state.carsMainPageReducer.cars);
  const [photosPreview, setPhotosPreview] = useState([]);
  const numberOfCars = parseInt(localStorage.getItem("numberOfUserCars")) || 0;

  const validationSchema = Yup.object({
    brand: Yup.string()
      .matches(/^[a-zA-Zа-яА-Я\s]*$/, "Лише букви")
      .required("Обов'язкове поле"),
    model: Yup.string().required("Обов'язкове поле"),
    photos: Yup.array()
      .min(2, "Потрібно додати два фото")
      .required("Обов'язкове поле"),
    year: Yup.string().required("Обов'язкове поле"),
    price: Yup.number()
      .required("Обов'язкове поле")
      .typeError("Лише цифри")
      .min(0, "Від'ємне число"),
    engineVolume: Yup.number()
      .required("Обов'язкове поле")
      .typeError("Лише цифри")
      .min(0, "Від'ємне число"),
    customsCleared: Yup.string().required("Обов'язкове поле"),
    mileage: Yup.number()
      .required("Обов'язкове поле")
      .typeError("Лише цифри")
      .min(0, "Від'ємне число"),
    description: Yup.string()
      .max(200, "Максимум 200 символів")
      .required("Обов'язкове поле"),
    location: Yup.string().required("Обов'язкове поле"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Номер має містити 10 цифр")
      .required("Обов'язкове поле"),
    fuelType: Yup.string().required("Обов'язкове поле"),
    transmission: Yup.string().required("Обов'язкове поле"),
    color: Yup.string().required("Обов'язкове поле"),
    bodyType: Yup.string().required("Обов'язкове поле"),
    driveType: Yup.string().required("Обов'язкове поле"),
    numberSeats: Yup.string().required("Обов'язкове поле"),
    technicalCondition: Yup.array()
      .min(1, "Потрібно обрати хоча б один варіант")
      .max(5, "Виберіть менше варіантів")
      .required("Обов'язкове поле"),
  });

  const formik = useFormik({
    initialValues: {
      brand: "",
      model: "",
      modification: "",
      photos: [],
      year: "",
      price: "",
      engineVolume: "",
      customsCleared: "",
      mileage: "",
      fuelType: "",
      fuelConsumption: "",
      transmission: "",
      color: "",
      bodyType: "",
      driveType: "",
      numberSeats: "",
      technicalCondition: [],
      comfort: [],
      multimedia: [],
      security: [],
      description: "",
      location: "",
      phone: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
    let maxId =
        cars.length > 0 ? Math.max(...cars.map((car) => car.id)) : 0;

    const userCars = [];
    let maxIdCar = maxId + numberOfCars;

    for (let i = maxId + 1; i <= maxIdCar; i++) {
      const car = JSON.parse(localStorage.getItem(`car_${i}`));
      if (car) {
        userCars.push(car);
      }
    }
    if(userCars.length===0 && numberOfCars!=0){
        maxIdCar=maxId;
    }

      const car = {
        ...values,
        id: maxIdCar + 1,
        photos: values.photos,
        technicalCondition: values.technicalCondition.join(", "),
        comfort: values.comfort.length > 0 ? values.comfort.join(", ") : "-",
        multimedia:
          values.multimedia.length > 0 ? values.multimedia.join(", ") : "-",
        security: values.security.length > 0 ? values.security.join(", ") : "-",
        datePublication: new Date().toLocaleDateString(),
        owner: localStorage.getItem("firstName") || "Невідомий",
      };

      localStorage.setItem(`car_${car.id}`, JSON.stringify(car));
      localStorage.setItem("numberOfUserCars", numberOfCars + 1);
      navigate("/");
    },
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
  
    Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then(base64Photos => {
      formik.setFieldValue("photos", base64Photos);
      setPhotosPreview(base64Photos);
    });
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} style={{ marginTop: "10px" }}>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Марка*"
            name="brand"
            value={formik.values.brand}
            onChange={formik.handleChange}
            error={formik.touched.brand && Boolean(formik.errors.brand)}
            helperText={formik.touched.brand && formik.errors.brand}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Модель*"
            name="model"
            value={formik.values.model}
            onChange={formik.handleChange}
            error={formik.touched.model && Boolean(formik.errors.model)}
            helperText={formik.touched.model && formik.errors.model}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Модифікація"
            name="modification"
            value={formik.values.modification}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" component="label">
            {formik.values.photos.length > 0 ? "Змінити" : "Завантажити фото"}
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </Button>
          {formik.touched.photos && formik.errors.photos && (
            <Typography color="error">{formik.errors.photos}</Typography>
          )}
          {photosPreview.length > 0 && (
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              {photosPreview.slice(0, 2).map((photo, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <img
                    src={photo}
                    alt={`Preview ${index}`}
                    style={{ width: "100%", height: "auto" }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Рік*</InputLabel>
            <Select
              name="year"
              value={formik.values.year}
              onChange={formik.handleChange}
              label="Рік"
              error={formik.touched.year && Boolean(formik.errors.year)}
            >
              {Array.from({ length: 35 }, (_, i) => 1990 + i).map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Ціна*"
            name="price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Об'єм двигуна*"
            name="engineVolume"
            type="number"
            inputProps={{ step: "0.1" }}
            value={formik.values.engineVolume}
            onChange={formik.handleChange}
            error={
              formik.touched.engineVolume && Boolean(formik.errors.engineVolume)
            }
            helperText={
              formik.touched.engineVolume && formik.errors.engineVolume
            }
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Розмитнена</InputLabel>
            <Select
              name="customsCleared"
              value={formik.values.customsCleared}
              onChange={formik.handleChange}
              label="Розмитнена*"
              error={
                formik.touched.customsCleared &&
                Boolean(formik.errors.customsCleared)
              }
              
            >
              <MenuItem value="Так">Так</MenuItem>
              <MenuItem value="Ні">Ні</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Пробіг*"
            name="mileage"
            type="number"
            value={formik.values.mileage}
            onChange={formik.handleChange}
            error={formik.touched.mileage && Boolean(formik.errors.mileage)}
            helperText={formik.touched.mileage && formik.errors.mileage}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Витрата палива"
            name="fuelConsumption"
            value={formik.values.fuelConsumption}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Коробка передач*</InputLabel>
            <Select
              name="transmission"
              value={formik.values.transmission}
              onChange={formik.handleChange}
              label="Коробка передач"
              error={
                formik.touched.transmission &&
                Boolean(formik.errors.transmission)
              }
            >
              <MenuItem value="Механічна">Механічна</MenuItem>
              <MenuItem value="Автоматична">Автоматична</MenuItem>
              <MenuItem value="Типтронік">Типтронік</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Вид палива*</InputLabel>
            <Select
              name="fuelType"
              value={formik.values.fuelType}
              onChange={formik.handleChange}
              label="Вид палива"
              error={formik.touched.fuelType && Boolean(formik.errors.fuelType)}

            >
              <MenuItem value="Бензин">Бензин</MenuItem>
              <MenuItem value="Дизель">Дизель</MenuItem>
              <MenuItem value="Газ/Бензин">Газ/Бензин</MenuItem>
              <MenuItem value="Електро">Електро</MenuItem>
              <MenuItem value="Гібрид">Гібрид</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Колір*</InputLabel>
            <Select
              name="color"
              value={formik.values.color}
              onChange={formik.handleChange}
              label="Колір"
              error={formik.touched.color && Boolean(formik.errors.color)}

            >
              <MenuItem value="Чорний">Чорний</MenuItem>
              <MenuItem value="Білий">Білий</MenuItem>
              <MenuItem value="Синій">Синій</MenuItem>
              <MenuItem value="Сірий">Сірий</MenuItem>
              <MenuItem value="Зелений">Зелений</MenuItem>
              <MenuItem value="Жовтий">Жовтий</MenuItem>
              <MenuItem value="Червоний">Червоний</MenuItem>
              <MenuItem value="Інший">Інший</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Тип кузова*</InputLabel>
            <Select
              name="bodyType"
              value={formik.values.bodyType}
              onChange={formik.handleChange}
              label="Тип кузова"
              error={formik.touched.bodyType && Boolean(formik.errors.bodyType)}
            >
              <MenuItem value="Кабріолет">Кабріолет</MenuItem>
              <MenuItem value="Пікап">Пікап</MenuItem>
              <MenuItem value="Купе">Купе</MenuItem>
              <MenuItem value="Універсал">Універсал</MenuItem>
              <MenuItem value="Седан">Седан</MenuItem>
              <MenuItem value="Позашляховик/Кроссовер">
                Позашляховик/Кроссовер
              </MenuItem>
              <MenuItem value="Хетчбек">Хетчбек</MenuItem>
              <MenuItem value="Мінівен">Мінівен</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Привід*</InputLabel>
            <Select
              name="driveType"
              value={formik.values.driveType}
              onChange={formik.handleChange}
              label="Привід"
              error={
                formik.touched.driveType && Boolean(formik.errors.driveType)
              }
            >
              <MenuItem value="Передній">Передній</MenuItem>
              <MenuItem value="Задній">Задній</MenuItem>
              <MenuItem value="Повний">Повний</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Кількість місць*</InputLabel>
            <Select
              name="numberSeats"
              value={formik.values.numberSeats}
              onChange={formik.handleChange}
              label="Кількість місць"
              error={
                formik.touched.numberSeats && Boolean(formik.errors.numberSeats)
              }
            >
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="6">6</MenuItem>
              <MenuItem value="7">7</MenuItem>
              <MenuItem value="8 і більше">8 і більше</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          <FormGroup>
            <Typography variant="h6">Технічний стан:</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  name="technicalCondition"
                  value="На ходу, Технічно справна"
                  checked={
                    Array.isArray(formik.values.technicalCondition) &&
                    formik.values.technicalCondition.includes(
                      "На ходу, Технічно справна"
                    )
                  }
                  onChange={formik.handleChange}
                />
              }
              label="На ходу, Технічно справна"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="technicalCondition"
                  value="Не бита"
                  checked={
                    Array.isArray(formik.values.technicalCondition) &&
                    formik.values.technicalCondition.includes("Не бита")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Не бита"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="technicalCondition"
                  value="Гаражне зберігання"
                  checked={
                    Array.isArray(formik.values.technicalCondition) &&
                    formik.values.technicalCondition.includes(
                      "Гаражне зберігання"
                    )
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Гаражне зберігання"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="technicalCondition"
                  value="Перший власник"
                  checked={
                    Array.isArray(formik.values.technicalCondition) &&
                    formik.values.technicalCondition.includes("Перший власник")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Перший власник"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="technicalCondition"
                  value="Потребує ремотну ходової"
                  checked={
                    Array.isArray(formik.values.technicalCondition) &&
                    formik.values.technicalCondition.includes(
                      "Потребує ремотну ходової"
                    )
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Потребує ремотну ходової"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="technicalCondition"
                  value="Після ДТП"
                  checked={
                    Array.isArray(formik.values.technicalCondition) &&
                    formik.values.technicalCondition.includes("Після ДТП")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Після ДТП"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="technicalCondition"
                  value="Потребує ремонту двигуна"
                  checked={
                    Array.isArray(formik.values.technicalCondition) &&
                    formik.values.technicalCondition.includes(
                      "Потребує ремонту двигуна"
                    )
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Потребує ремонту двигуна"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="technicalCondition"
                  value="Не на ходу"
                  checked={
                    Array.isArray(formik.values.technicalCondition) &&
                    formik.values.technicalCondition.includes("Не на ходу")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Не на ходу"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={5} style={{ marginTop: "10px" }}>
          <FormGroup>
            <Typography variant="h6">Комфорт:</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  name="comfort"
                  value="Кондиціонер"
                  checked={
                    Array.isArray(formik.values.comfort) &&
                    formik.values.comfort.includes("Кондиціонер")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Кондиціонер"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="comfort"
                  value="Клімат-контроль"
                  checked={
                    Array.isArray(formik.values.comfort) &&
                    formik.values.comfort.includes("Клімат-контроль")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Клімат-контроль"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="comfort"
                  value="Електропакет"
                  checked={
                    Array.isArray(formik.values.comfort) &&
                    formik.values.comfort.includes("Електропакет")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Електропакет"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="comfort"
                  value="Підігрів сидінь"
                  checked={
                    Array.isArray(formik.values.comfort) &&
                    formik.values.comfort.includes("Підігрів сидінь")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Підігрів сидінь"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="comfort"
                  value="Парктроник"
                  checked={
                    Array.isArray(formik.values.comfort) &&
                    formik.values.comfort.includes("Парктроник")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Парктроник"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="comfort"
                  value="Панорамний дах"
                  checked={
                    Array.isArray(formik.values.comfort) &&
                    formik.values.comfort.includes("Панорамний дах")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Панорамний дах"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="comfort"
                  value="Тонування скла"
                  checked={
                    Array.isArray(formik.values.comfort) &&
                    formik.values.comfort.includes("Тонування скла")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Тонування скла"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="comfort"
                  value="Пам'ять сидінь"
                  checked={
                    Array.isArray(formik.values.comfort) &&
                    formik.values.comfort.includes("Пам'ять сидінь")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Пам'ять сидінь"
            />
          </FormGroup>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          style={{ marginTop: "10px", marginLeft: "10px" }}
        >
          <FormGroup>
            <Typography variant="h6">Мультимедіа:</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  name="multimedia"
                  value="AUX"
                  checked={
                    Array.isArray(formik.values.multimedia) &&
                    formik.values.multimedia.includes("AUX")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="AUX"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="multimedia"
                  value="USB"
                  checked={
                    Array.isArray(formik.values.multimedia) &&
                    formik.values.multimedia.includes("USB")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="USB"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="multimedia"
                  value="Bluetooth"
                  checked={
                    Array.isArray(formik.values.multimedia) &&
                    formik.values.multimedia.includes("Bluetooth")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Bluetooth"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="multimedia"
                  value="Акустика"
                  checked={
                    Array.isArray(formik.values.multimedia) &&
                    formik.values.multimedia.includes("Акустика")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Акустика"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="multimedia"
                  value="Сабвуфер"
                  checked={
                    Array.isArray(formik.values.multimedia) &&
                    formik.values.multimedia.includes("Сабвуфер")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Сабвуфер"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="multimedia"
                  value="Система навігації GPS"
                  checked={
                    Array.isArray(formik.values.multimedia) &&
                    formik.values.multimedia.includes("Система навігації GPS")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Система навігації GPS"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12} sm={5} style={{ marginTop: "10px" }}>
          <FormGroup>
            <Typography variant="h6">Безпека:</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  name="security"
                  value="ABS"
                  checked={
                    Array.isArray(formik.values.security) &&
                    formik.values.security.includes("ABS")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="ABS"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="security"
                  value="LED фари"
                  checked={
                    Array.isArray(formik.values.security) &&
                    formik.values.security.includes("LED фари")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="LED фари"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="security"
                  value="Сигналізація"
                  checked={
                    Array.isArray(formik.values.security) &&
                    formik.values.security.includes("Сигналізація")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Сигналізація"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="security"
                  value="Подушкa безпеки"
                  checked={
                    Array.isArray(formik.values.security) &&
                    formik.values.security.includes("Подушкa безпеки")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Подушкa безпеки"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="security"
                  value="GPS трекер"
                  checked={
                    Array.isArray(formik.values.security) &&
                    formik.values.security.includes("GPS трекер")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="GPS трекер"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="security"
                  value="Безключовий доступ"
                  checked={
                    Array.isArray(formik.values.security) &&
                    formik.values.security.includes("Безключовий доступ")
                  }
                  onChange={formik.handleChange}
                />
              }
              label="Безключовий доступ"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Опис"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Місцезнаходження"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Номер телефону"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={numberOfCars >= 5}
          >
            Додати оголошення
          </Button>
          {numberOfCars >= 5 && (
            <Typography color="error" style={{ marginTop: "10px" }}>
              Кількість оголошень = {numberOfCars}. Видаліть одне з оголошень
              або отримайте Premium.
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => navigate("/")}
          >
            Скасувати
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default AddCar;
