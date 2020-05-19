import * as rtl from '@testing-library/react'
import {screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {buildUser} from 'test/generate'

// TODO: open an issue on DOM Testing Library to make this built-in...
async function waitForElementToBeRemoved(...args) {
  try {
    await rtl.waitForElementToBeRemoved(...args)
  } catch (error) {
    rtl.screen.debug()
    throw error
  }
}

beforeAll(() => {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.append(root)
  document.body.focus()
})

test('can login and use the book search', async () => {
  require('../index')

  const user = buildUser()

  // for the extra credit
  const loading = screen.queryByLabelText(/loading/i)
  if (loading) {
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  }

  userEvent.click(screen.getByRole('button', {name: /register/i}))
  await userEvent.type(screen.getByLabelText(/username/i), user.username)
  await userEvent.type(screen.getByLabelText(/password/i), user.password)

  userEvent.click(screen.getByRole('button', {name: /register/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const searchInput = screen.getByPlaceholderText(/search/i)
  userEvent.type(searchInput, 'voice of war')

  const searchIcon = screen.getByLabelText(/search/i)
  searchIcon.closest('button').focus()
  userEvent.click(searchIcon)
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  expect(screen.getByText(/voice of war/i)).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', {name: /logout/i}))

  expect(searchInput).not.toBeInTheDocument()
})
