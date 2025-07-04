from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
import requests


class BOT:
    def __init__(self):
        # Initialize Chrome options
        options = Options()
        # options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--start-fullscreen")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-web-security")
        options.add_argument("--allow-running-insecure-content")

        # Set up ChromeDriver
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()), options=options
        )
        self.base_url = "https://projects.hackerearth.com/p9/"
        self.wait = WebDriverWait(self.driver, 3)
        self.long_wait = WebDriverWait(self.driver, 10)
        self.short_wait = WebDriverWait(self.driver, 0.5)
        self.driver.get(self.base_url)

    # common functions
    def close_annoying_modal(self):
        modal_selector = "//div[@role='dialog' and .//div[@class='ant-modal-title' and contains(text(),'An annnoying Modal to hinder you')] ]"

        try:
            _modal_element = self.short_wait.until(
                EC.visibility_of_element_located((By.XPATH, modal_selector))
            )
            print("found annoying modal")

        except TimeoutException:
            return False

            # Strategy 1: Try to click the close button (X)
        close_button_selector = "//div[@role='dialog' and .//div[@class='ant-modal-title' and contains(text(),'An annnoying Modal to hinder you')] ]//button"
        close_btn = self.driver.find_element(By.XPATH, close_button_selector)
        if close_btn.is_displayed() and close_btn.is_enabled():
            close_btn.click()
            # Wait a moment for modal to disappear
            self.driver.implicitly_wait(0.5)

        # # Strategy 2: Try pressing ESC key

        # self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
        # self.driver.implicitly_wait(1)
        return True

    def safe_click(self, locator, locator_type=By.XPATH):
        element = self.wait.until(
            EC.presence_of_element_located((locator_type, locator))
        )

        # Scroll to element to ensure it is in view
        self.driver.execute_script("arguments[0].scrollIntoView(true);", element)

        # Wait for the element to be clickable and click it
        self.wait.until(
            EC.visibility_of_element_located((locator_type, locator))
        ).click()

    # task 1
    def navigate_to_system_logs(self):
        self.driver.get(self.base_url + "system-logs.html")
        self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "body > h3")))

    def switch_to_analytics_iframe(self):
        """Switch to the analytics iframe"""
        # Wait for iframe to be present and switch to it
        iframe = self.wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "iframe[src='./analytics.html']")
            )
        )
        self.driver.switch_to.frame(iframe)

    def extract_link_from_iframe(self):
        """Extract the API link from within the iframe"""
        link_element = self.wait.until(
            EC.presence_of_element_located(
                (By.PARTIAL_LINK_TEXT, "View Full Analytics")
            )
        )
        link_url = link_element.get_attribute("href")
        return link_url

    def check_link_status(self, url):
        try:
            response = requests.get(url)
            _status_code = response.status_code
        except Exception:
            return False

        return True

    def check_if_analytics_link_is_working(self):
        self.navigate_to_system_logs()
        self.switch_to_analytics_iframe()
        link_url = self.extract_link_from_iframe()
        self.driver.switch_to.default_content()
        link_status = self.check_link_status(link_url)
        self.driver.get(self.base_url)

        return {"link_url": link_url, "is_broken": not link_status}

    # task 2
    def drag_ticket_0002_to_done_and_get_alert(self):
        """Drag ticket 0002 to DONE column and capture the alert message"""

        self.wait.until(
            EC.presence_of_element_located(
                (
                    By.XPATH,
                    "//h4[text()='TODO']",
                )
            )
        )

        # Locate ticket 0002 (using text content to find the specific ticket)
        ticket_selector = "//div[@data-testid='ticket-TICKET-0002']"
        ticket_element = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, ticket_selector))
        )

        # Locate DONE column drop zone
        done_column_selector = "//div[@data-testid='drop-zone-DONE']"

        done_column = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, done_column_selector))
        )
        self.close_annoying_modal()
        actions = ActionChains(self.driver)
        actions.drag_and_drop(ticket_element, done_column).perform()

        # Capture alert message from notification
        alert_selector = "//div[@class='ant-notification-notice-message']"

        alert_element = self.long_wait.until(
            EC.presence_of_element_located((By.XPATH, alert_selector))
        )
        alert_message = alert_element.text
        return {"alert_message": alert_message}

    # task 3
    def edit_ticket_0003_and_get_alert(self):
        """Edit ticket 0003 and capture the alert message"""
        ticket_selector = "//div[@data-testid='ticket-TICKET-0003']"
        edit_ticket_selector = (
            "//div[@data-testid='ticket-TICKET-0003']//span[@aria-label='edit']"
        )

        ticket_element = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, ticket_selector))
        )
        # Hover over the ticket to reveal the edit button  and click it
        self.close_annoying_modal()
        actions = ActionChains(self.driver)
        actions.move_to_element(ticket_element).perform()

        self.safe_click(edit_ticket_selector)

        # change status to done
        status_selector = "//div[./label[@title='Status']]/following-sibling::div"

        done_status_selector = (
            "//div[contains(@class,'ant-select-item') and @title='DONE']"
        )
        max_attempts = 2
        for attempt in range(max_attempts):
            try:
                self.safe_click(status_selector)
                self.safe_click(done_status_selector)

            except Exception as e:
                _modal_handled = self.close_annoying_modal()
                if attempt == max_attempts - 1:
                    print(f"❌ safe_click failed after {max_attempts} attempts: {e}")
                    raise e

        # change assignee to bob smith
        selector_for_assignee = (
            "//div[./label[@title='Assignee']]/following-sibling::div"
        )
        selector_for_bob_smith = (
            "//div[contains(@class,'ant-select-item') and @title='Bob Smith']"
        )

        for attempt in range(max_attempts):
            try:
                self.safe_click(selector_for_assignee)
                self.safe_click(selector_for_bob_smith)

            except Exception as e:
                _modal_handled = self.close_annoying_modal()
                if attempt == max_attempts - 1:
                    print(f"❌ safe_click failed after {max_attempts} attempts: {e}")
                    raise e

        # change deadline to 2030-10-10

        deadline_selector = "deadline"
        deadline_element = self.wait.until(
            EC.visibility_of_element_located((By.ID, deadline_selector))
        )
        # self.click(deadline_selector)
        deadline_element.clear()
        deadline_element.send_keys("2030-10-10")

        # click save button
        save_button_selector = "//span[normalize-space()='Save Changes']"
        self.safe_click(save_button_selector)

        # get alert message
        alert_selector = "//div[@class='ant-notification-notice-message']"

        alert_element = self.long_wait.until(
            EC.visibility_of_element_located((By.XPATH, alert_selector))
        )
        alert_message = alert_element.text
        return {"alert_message": alert_message}

    def quit_driver(self):
        self.driver.quit()


def main():
    """Main execution function"""
    bot = BOT()

    try:
        # Run task 2: drag and drop test
        result1 = bot.check_if_analytics_link_is_working()
        result2 = bot.drag_ticket_0002_to_done_and_get_alert()
        result3 = bot.edit_ticket_0003_and_get_alert()

        print("Analytics Link Result:", result1)
        print("Drag and Drop Result:", result2)
        print("Edit Ticket Result:", result3)

    finally:
        bot.quit_driver()


if __name__ == "__main__":
    main()
