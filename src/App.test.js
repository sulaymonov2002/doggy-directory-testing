import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import mockFetch from "./mocks/mockFetch";
import App from "./App";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
  jest.spyOn(window, "fetch").mockImplementation(mockFetch);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders the landing page", async () => {
  render(<App />);

  expect(screen.getByRole("heading")).toHaveTextContent(/Doggy Directory/);

  // Check whether the given element has a text content or not.
  // When a string argument is passed through, it will perform a partial case-sensitive match to the element content.
  // To perform a case-insensitive match, you can use a RegExp with the /i modifier.
  // If you want to match the whole content, you can use a RegExp to do it.

  expect(screen.getByRole("combobox")).toHaveDisplayValue("Select a breed");

  // This allows you to check whether the given form element
  // has the specified displayed value(the one the end user will see).
  // It accepts, and elements with the exception of and, which can be
  // meaningfully matched only using toBeChecked or toHaveFormValues.

  expect(
    await screen.findByRole("option", { name: "husky" })
  ).toBeInTheDocument();

  expect(screen.getByRole("button", { name: "Search" })).toBeDisabled();

  // Allows you to check whether an element is disabled
  // from the user's perspective.
  // Matches if the element is a form control and the disabled attribute is specified on this element
  // or the element is a descendant of a form element with a disabled attribute.

  expect(screen.getByRole("img")).toBeInTheDocument();
});

test("should be able to search and display dog image results", async () => {
  render(<App />);

  // Simulating selecting an option and verifying its value
  const select = screen.getByRole("combobox");
  expect(
    await screen.findByRole("option", { name: "cattledog" })
  ).toBeInTheDocument();
  userEvent.selectOptions(select, "cattledog");
  expect(select).toHaveValue("cattledog");

  // Initiate the search request
  const searchBtn = screen.getByRole("button", { name: "Search" });
  userEvent.click(searchBtn);

  // Loading state displays and gets removed once results are displayed
  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

  // Verify image display and results count
  const dogImages = screen.getAllByRole("img");
  expect(dogImages).toHaveLength(2);
  expect(screen.getByText(/2 Results/i)).toBeInTheDocument();
  expect(dogImages[0]).toHaveAccessibleName("cattledog 1 of 2");
  expect(dogImages[1]).toHaveAccessibleName("cattledog 2 of 2");
});
