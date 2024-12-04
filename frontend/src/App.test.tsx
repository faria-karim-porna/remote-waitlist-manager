import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { UserAction, UserReducer } from './components/core/redux/slices/userSlice';
import { joinUser } from './components/core/redux/apiSlices/userApiSlice';
import { FormSection } from './components/formSection';

// Mock the Redux store

const mockDispatch = jest.fn();

jest.mock('./components/core/redux/store', () => ({
  useAppDispatch: () => mockDispatch,
}));

// Mock the API function
jest.mock('./components/core/redux/apiSlices/userApiSlice', () => ({
  joinUser: jest.fn(),
}));

jest.mock('./components/storages/localStorage', () => ({
  setUserInSessionStorage: jest.fn(),
}));

describe('FormSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles form submission and dispatches joinUser', async () => {
    // Mock joinUser to resolve with a response
    const mockUserResponse = { name: 'John Doe', partySize: 4 };
    (joinUser as unknown as jest.Mock).mockResolvedValue(mockUserResponse);

    // Mock dispatch to resolve the same value as joinUser
    mockDispatch.mockResolvedValue({
      payload: mockUserResponse,
    });

    const store = configureStore({ reducer: { user: UserReducer } });
    render(
      <Provider store={store}>
        <FormSection />
      </Provider>
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Party size (not more than 10)'), {
      target: { value: '4' },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText('Submit'));

    await new Promise((resolve) => setTimeout(resolve, 0));
    // Assert that joinUser was called with the correct arguments
    expect(joinUser).toHaveBeenCalledWith({ name: 'John Doe', partySize: 4 });

    // Assert that dispatch was called with the result of joinUser
    // expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));

    // Assert UserAction.setUserInfo was dispatched with the correct payload
    expect(mockDispatch).toHaveBeenCalledWith(
      UserAction.setUserInfo(mockUserResponse)
    );
  });
});
