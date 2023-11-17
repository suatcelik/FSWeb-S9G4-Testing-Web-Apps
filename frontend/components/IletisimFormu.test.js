import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

beforeEach(() => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  const header = screen.getByText("İletişim Formu");
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  // kullanıcı adı alanını seç
  const adInput = screen.getByPlaceholderText("İlhan");
  // kullanıcı adı alanına 4 karakter gir
  /*  
  // eski yöntem
   userEvent.type(adInput, "test");
   */
  // yeni yöntem
  fireEvent.change(adInput, { target: { value: "İrem" } });

  // ekrandan hata mesajlarını ara
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    // hata mesajlarının 1 tane olduğunu doğrula
    expect(errorMessages).toHaveLength(1);
  });
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));

  // ekrandan hata mesajlarını ara
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    // hata mesajlarının 3 tane olduğunu doğrula
    expect(errorMessages).toHaveLength(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Doğru uzunlukta isim" } });

  const soyadInput = screen.getByLabelText("Soyad*");
  fireEvent.change(soyadInput, { target: { value: "Bir Soyisim" } });

  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));

  // ekrandan hata mesajlarını ara
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    // hata mesajlarının 1 tane olduğunu doğrula
    expect(errorMessages).toHaveLength(1);
  });
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const emailInput = screen.getByLabelText("Email*");
  fireEvent.change(emailInput, { target: { value: "gecersizmail" } });

  // ekrandan hata mesajlarını ara
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    // hata mesajlarının 1 tane olduğunu doğrula
    expect(errorMessages).toHaveLength(1);

    // hata mesajının "email geçerli bir email adresi olmalıdır." olduğunu doğrula
    expect(errorMessages[0]).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });

  userEvent.type(emailInput, "abc.com");
  const emailHataMesaj = new RegExp(
    "email geçerli bir email adresi olmalıdır.",
    "i"
  );
  expect(screen.getByText(emailHataMesaj)).toBeInTheDocument();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Doğru uzunlukta isim" } });
  const emailInput = screen.getByLabelText("Email*");
  fireEvent.change(emailInput, { target: { value: "gecerli@mail.com" } });

  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));

  // ekrandan hata mesajlarını ara
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    // hata mesajının "soyad gereklidir." olduğunu doğrula
    expect(errorMessages[0]).toHaveTextContent("soyad gereklidir.");
  });
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  // ad, soyad, email gir
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Doğru uzunlukta isim" } });

  const soyadInput = screen.getByLabelText("Soyad*");
  fireEvent.change(soyadInput, { target: { value: "Bir Soyisim" } });

  const emailInput = screen.getByLabelText("Email*");
  fireEvent.change(emailInput, { target: { value: "gecerli@mail.com" } });

  // formu gönder
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));

  // Render edilen hatayo ara
  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    // hata mesajlarının 0 tane olduğunu doğrula
    expect(errorMessages).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const adInput = screen.getByPlaceholderText("İlhan");
  fireEvent.change(adInput, { target: { value: "Doğru uzunlukta isim" } });

  const soyadInput = screen.getByLabelText("Soyad*");
  fireEvent.change(soyadInput, { target: { value: "Bir Soyisim" } });

  const emailInput = screen.getByLabelText("Email*");
  fireEvent.change(emailInput, { target: { value: "gecerli@mail.com" } });

  const mesajInput = screen.getByLabelText("Mesaj");
  fireEvent.change(mesajInput, { target: { value: "Test Mesajı" } });

  // formu gönder
  fireEvent(screen.getByText("Gönder"), new MouseEvent("click"));

  // Render edilen değerleri ara
  await waitFor(() => {
    const ad = screen.getByTestId("firstnameDisplay");
    const soyad = screen.getByTestId("lastnameDisplay");
    const email = screen.getByTestId("emailDisplay");
    const mesaj = screen.getByTestId("messageDisplay");

    expect(ad).toHaveTextContent("Doğru uzunlukta isim");
    expect(soyad).toHaveTextContent("Bir Soyisim");
    expect(email).toHaveTextContent("gecerli@mail.com");
    expect(mesaj).toHaveTextContent("Test Mesajı");
  });
});
