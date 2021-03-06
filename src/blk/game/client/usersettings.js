/**
 * Copyright 2012 Google, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('blk.game.client.UserSettings');

goog.require('blk.env.ChunkView');
goog.require('goog.net.Cookies');
goog.require('goog.string');



// TODO(benvanik): refactor into something cleaner/declarative
/**
 * User settings that persist across sessions.
 * @constructor
 * @param {!goog.dom.DomHelper} dom DOM helper.
 */
blk.game.client.UserSettings = function(dom) {
  /**
   * @private
   * @type {!goog.dom.DomHelper}
   */
  this.dom_ = dom;

  /**
   * User name used for display.
   * @type {string}
   */
  this.userName = blk.game.client.UserSettings.DEFAULT_USER_NAME_;

  /**
   * Mouse sensitivity scalar. 1.0 is default, 1.0+ is more sensitive.
   * @type {number}
   */
  this.mouseSensitivity =
      blk.game.client.UserSettings.DEFAULT_MOUSE_SENSITIVITY_;

  /**
   * Whether to lock the mouse cursor on focus.
   * @type {boolean}
   */
  this.mouseLock = blk.game.client.UserSettings.DEFAULT_MOUSE_LOCK_;

  /**
   * View distance setting, in chunk units.
   * Automatically clamped between {@see blk.env.ChunkView.MIN_CHUNK_RADIUS_XZ}
   * and {@see blk.env.ChunkView.MAX_CHUNK_RADIUS_XZ}.
   * @type {number}
   */
  this.viewDistance = blk.game.client.UserSettings.DEFAULT_VIEW_DISTANCE_;

  /**
   * Whether sound FX playback is muted.
   * @type {boolean}
   */
  this.soundFxMuted = blk.game.client.UserSettings.DEFAULT_SOUND_FX_MUTED_;

  /**
   * Whether music playback is muted.
   * @type {boolean}
   */
  this.musicMuted = blk.game.client.UserSettings.DEFAULT_MUSIC_MUTED_;
};


/**
 * @private
 * @const
 * @type {string}
 */
blk.game.client.UserSettings.DEFAULT_USER_NAME_ = 'User';


/**
 * @private
 * @const
 * @type {number}
 */
blk.game.client.UserSettings.DEFAULT_MOUSE_SENSITIVITY_ = 1;


/**
 * @private
 * @const
 * @type {boolean}
 */
blk.game.client.UserSettings.DEFAULT_MOUSE_LOCK_ = true;


/**
 * @private
 * @const
 * @type {number}
 */
blk.game.client.UserSettings.DEFAULT_VIEW_DISTANCE_ =
    blk.env.ChunkView.LOW_CHUNK_RADIUS_XZ;


/**
 * @private
 * @const
 * @type {boolean}
 */
blk.game.client.UserSettings.DEFAULT_SOUND_FX_MUTED_ = false;


/**
 * @private
 * @const
 * @type {boolean}
 */
blk.game.client.UserSettings.DEFAULT_MUSIC_MUTED_ = false;


/**
 * Clones the settings at their current values.
 * @return {!blk.game.client.UserSettings} A clone of the given instance.
 */
blk.game.client.UserSettings.prototype.clone = function() {
  var settings = new blk.game.client.UserSettings(this.dom_);
  settings.userName = this.userName;
  settings.mouseSensitivity = this.mouseSensitivity;
  settings.mouseLock = this.mouseLock;
  settings.viewDistance = this.viewDistance;
  settings.soundFxMuted = this.soundFxMuted;
  settings.musicMuted = this.musicMuted;
  return settings;
};


/**
 * Resets all settings to their defaults.
 */
blk.game.client.UserSettings.prototype.reset = function() {
  this.userName = blk.game.client.UserSettings.DEFAULT_USER_NAME_;
  this.mouseSensitivity =
      blk.game.client.UserSettings.DEFAULT_MOUSE_SENSITIVITY_;
  this.mouseLock = blk.game.client.UserSettings.DEFAULT_MOUSE_LOCK_;
  this.viewDistance = blk.game.client.UserSettings.DEFAULT_VIEW_DISTANCE_;
  this.soundFxMuted = blk.game.client.UserSettings.DEFAULT_SOUND_FX_MUTED_;
  this.musicMuted = blk.game.client.UserSettings.DEFAULT_MUSIC_MUTED_;
};


/**
 * Attempts to load settings from the persistent store.
 * Silently fails and sets defaults if they cannot be loaded.
 */
blk.game.client.UserSettings.prototype.load = function() {
  var cookies = new goog.net.Cookies(this.dom_.getDocument());
  this.userName = /** @type {string} */ (cookies.get('s_un', this.userName));
  this.userName = goog.string.urlDecode(this.userName);
  if (this.userName.length < 1) {
    this.userName = blk.game.client.UserSettings.DEFAULT_USER_NAME_;
  }
  this.mouseSensitivity =
      Number(cookies.get('s_ms', String(this.mouseSensitivity)));
  if (this.mouseSensitivity <= 0.0 || this.mouseSensitivity > 10) {
    this.mouseSensitivity =
        blk.game.client.UserSettings.DEFAULT_MOUSE_SENSITIVITY_;
  }
  this.mouseLock =
      cookies.get('s_ml', String(this.mouseLock)) == 'true';
  this.viewDistance =
      Number(cookies.get('s_vd', String(this.viewDistance))) | 0;
  if (this.viewDistance <= blk.env.ChunkView.MIN_CHUNK_RADIUS_XZ ||
      this.viewDistance > blk.env.ChunkView.MAX_CHUNK_RADIUS_XZ) {
    this.viewDistance = blk.game.client.UserSettings.DEFAULT_VIEW_DISTANCE_;
  }
  this.soundFxMuted =
      cookies.get('s_sm', String(this.soundFxMuted)) == 'true';
  this.musicMuted =
      cookies.get('s_mm', String(this.musicMuted)) == 'true';
};


/**
 * Attempts to save settings to the persistent store.
 * Silently fails if they cannot be saved.
 */
blk.game.client.UserSettings.prototype.save = function() {
  var cookies = new goog.net.Cookies(this.dom_.getDocument());
  cookies.set('s_un', goog.string.urlEncode(this.userName));
  cookies.set('s_ms', String(this.mouseSensitivity));
  cookies.set('s_ml', String(this.mouseLock));
  cookies.set('s_vd', String(this.viewDistance));
  cookies.set('s_sm', String(this.soundFxMuted));
  cookies.set('s_mm', String(this.musicMuted));
};
