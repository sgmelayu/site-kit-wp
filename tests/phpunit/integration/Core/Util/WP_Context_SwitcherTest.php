<?php
/**
 * Class Google\Site_Kit\Tests\Core\Util\WP_Context_SwitcherTest
 *
 * @package   Google\Site_Kit\Tests\Core\Util
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Core\Util;

use Google\Site_Kit\Core\Util\WP_Context_Switcher;
use Google\Site_Kit\Tests\TestCase;

/**
 * @group Util
 */
class WP_Context_SwitcherTest extends TestCase {

	public function test_with_frontend_context() {
		$this->go_to( '/' );
		$this->assertFalse( is_admin() );

		// No need to switch to 'front' context when already in frontend.
		$restore_context = WP_Context_Switcher::with_frontend_context();
		$this->assertFalse( is_admin() );
		$this->assertFalse( $restore_context() );

		set_current_screen( 'edit.php' );
		$this->assertTrue( is_admin() );

		// Switch from admin to 'front' context.
		$restore_context = WP_Context_Switcher::with_frontend_context();
		$this->assertFalse( is_admin() );
		$this->assertTrue( $restore_context() );
	}

	public function test_with_admin_context() {
		$this->go_to( '/' );
		$this->assertFalse( is_admin() );

		// Switch from frontend to 'admin' context.
		$restore_context = WP_Context_Switcher::with_admin_context();
		$this->assertTrue( is_admin() );
		$this->assertTrue( $restore_context() );

		set_current_screen( 'edit.php' );
		$this->assertTrue( is_admin() );

		// No need to switch to 'admin' context when already in admin.
		$restore_context = WP_Context_Switcher::with_admin_context();
		$this->assertTrue( is_admin() );
		$this->assertFalse( $restore_context() );
	}
}
