/**
 * RP UNIFIED CORE ENGINE — Character-Agnostic Core for GitHub + jsDelivr + Google AI Studio
 * Version: 3.0.0 (Modular Multi-Character Architecture)
 *
 * This file contains ZERO character-specific map data.
 *   - Shared modes (work for ALL characters/bots):
 *       mode: "recap"    -> Storyline Recap [HARD_LOCK] dossier + 1-click Copy Markdown
 *       mode: "transfer" -> Narrative Transfer Pack [HARD_LOCK] + Restoration Protocol + 1-click Copy New Chat
 *   - World-specific mode:
 *       mode: "map"      -> Renders ONLY the world registered via worlds/<character>.js matching RP_DATA.world.
 *                           Never falls back to another character's map.
 *   - Extensibility:
 *       window.RPEngine.registerWorld(worldDef)
 *       window.RPEngine.registerMode(modeName, renderFn)
 */
(function (global) {
  'use strict';

  var INK = '#111111';
  var INK_SOFT = '#3D3A35';
  var PAPER = '#FAF8F4';
  var CRIMSON = '#8B1E1E';

  var CURRENT_SCRIPT = document.currentScript;
  var ENGINE_BASE = '';
  if (CURRENT_SCRIPT && CURRENT_SCRIPT.src) {
    ENGINE_BASE = CURRENT_SCRIPT.src.replace(/\/[^/?#]+(?:[?#].*)?$/, '');
  }

  // Registries (can be populated before OR after engine.js loads)
  var WORLDS = (global.RP_WORLDS && typeof global.RP_WORLDS === 'object') ? global.RP_WORLDS : {};
  global.RP_WORLDS = WORLDS;

  var MODES = {};

  function norm(s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd');
  }

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolveAssetUrl(rawPath, worldDef) {
    if (!rawPath) return '';
    if (/^(https?:|data:|\/)/i.test(rawPath)) return rawPath;
    var base = (worldDef && worldDef.assetBase) || ENGINE_BASE || '.';
    return base.replace(/\/+$/, '') + '/' + rawPath.replace(/^\.\//, '').replace(/^\/+/, '');
  }

  function ensureStylesAndFonts() {
    if (!document.getElementById('rp-engine-fonts')) {
      var link = document.createElement('link');
      link.id = 'rp-engine-fonts';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Spectral:ital,wght@0,400;0,600;0,700;1,400&display=swap';
      document.head.appendChild(link);
    }
    if (!document.getElementById('rp-engine-css')) {
      var style = document.createElement('style');
      style.id = 'rp-engine-css';
      style.textContent = [
        '.vm-root{font-family:"Spectral",Georgia,serif;color:#111111;background:#EAE6DC;border:1px solid #111111;max-width:1200px;margin:0 auto;box-shadow:4px 4px 0 rgba(17,17,17,.16);user-select:none}',
        '.vm-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;background:#F2EFE8;border-bottom:1px solid #111111}',
        '.vm-tabs{display:inline-flex;border:1px solid #111111;background:#FAF8F4;padding:2px;gap:2px}',
        '.vm-btn{font-family:"Spectral",Georgia,serif;font-size:12px;font-weight:600;border:none;background:transparent;color:#111111;padding:4px 10px;cursor:pointer;display:inline-flex;align-items:center;gap:5px}',
        '.vm-btn:hover{background:#E7E3DA}',
        '.vm-btn.is-active{background:#111111;color:#FAF8F4}',
        '.vm-btn-outline{border:1px solid rgba(17,17,17,.45);background:#FAF8F4}',
        '.vm-btn-crimson{border:1px solid #8B1E1E;color:#8B1E1E;background:#FAF8F4}',
        '.vm-btn-crimson:hover{background:#8B1E1E;color:#FAF8F4}',
        '.vm-stage{position:relative;width:100%;background:#FAF8F4;overflow:hidden}',
        '.vm-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}',
        '.vm-svg{position:relative;z-index:2;width:100%;height:100%;display:block}',
        '.vm-zone{cursor:pointer}',
        '.vm-zone:hover .vm-zone-fill{fill:rgba(17,17,17,.08)}',
        '.vm-zone:hover .vm-zone-stroke{stroke-width:1.9}',
        '.vm-foot{padding:10px 14px;background:#FAF8F4;border-top:1px solid #111111;font-size:12.5px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}',
        '.vm-loc-title{font-family:"Playfair Display","Spectral",Georgia,serif;font-weight:700;letter-spacing:.03em;color:#8B1E1E}',
        '.vm-inspector{position:absolute;top:12px;right:12px;z-index:10;width:280px;max-height:calc(100% - 24px);overflow-y:auto;background:#FAF8F4;border:1px solid #111111;box-shadow:4px 4px 0 rgba(17,17,17,.18);font-size:12px}',
        '.vm-inspector-hd{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:#F2EFE8;border-bottom:1px solid #111111;font-family:"Playfair Display",Georgia,serif;font-weight:700;text-transform:uppercase;font-size:12px}',
        '.vm-inspector-bd{padding:10px;line-height:1.5}',
        '.vm-npc-badge{display:inline-block;font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:1px 5px;border:1px solid rgba(17,17,17,.4);background:#EFECE4;color:#111111;vertical-align:middle;line-height:1.35}',
        '.vm-npc-badge.is-dead{border-color:#8B1E1E;color:#8B1E1E;background:#FAF2F0}',
        '.vm-npc-badge.is-missing{border-style:dashed;border-color:#6B665D;color:#55524B;background:#F5F2EA}',
        '.vm-insp-npc{border-top:1px solid rgba(17,17,17,.18);padding-top:8px;margin-top:8px;font-size:12px}',
        '.vm-npc-callout{border-left:2.5px solid #111111;padding:1px 0 1px 9px;margin-bottom:8px}',
        '.vm-npc-callout.is-dead{border-left-color:#8B1E1E}',
        '.vm-npc-callout.is-missing{border-left-color:#6B665D}',
        '.vm-npc-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px;line-height:1.35}',
        '.vm-npc-role{font-size:11.5px;color:#3D3A35;margin-top:2px}',
        /* Shared Dossier Styles for /recap, /transfer & future text modes */
        '.vd-root{font-family:"Spectral",Georgia,serif;color:#111111;background:#FAF8F4;border:1.5px solid #111111;max-width:960px;margin:0 auto;box-shadow:5px 5px 0 rgba(17,17,17,.16);line-height:1.62;user-select:text}',
        '.vd-inner{border:1px solid rgba(17,17,17,.35);margin:4px}',
        '.vd-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:12px 16px;background:#F2EFE8;border-bottom:1.5px solid #111111}',
        '.vd-title{font-family:"Playfair Display","Spectral",Georgia,serif;font-size:17px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;margin:0}',
        '.vd-sub{font-size:11.5px;color:#55524B;margin-top:2px;font-style:italic}',
        '.vd-actions{display:flex;flex-wrap:wrap;gap:6px}',
        '.vd-body{padding:16px 18px;display:flex;flex-direction:column;gap:14px}',
        '.vd-sec{border:1px solid rgba(17,17,17,.25);background:#FFFFFF}',
        '.vd-sec-hd{padding:6px 12px;background:#F5F2EA;border-bottom:1px solid rgba(17,17,17,.2);font-family:"Playfair Display","Spectral",Georgia,serif;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between;gap:8px}',
        '.vd-sec-hd.is-crimson{color:#8B1E1E;background:#F8F1EE;border-bottom-color:rgba(139,30,30,.25)}',
        '.vd-sec-bd{padding:10px 14px;font-size:13.5px;white-space:pre-wrap;word-break:break-word}',
        '.vd-ledger-list{display:flex;flex-direction:column;gap:8px;padding:10px 14px}',
        '.vd-ledger-item{border-left:2.5px solid #111111;padding:6px 10px;background:#FAF8F4;font-size:13px}',
        '.vd-ledger-id{font-family:"Playfair Display",Georgia,serif;font-weight:700;color:#8B1E1E;font-size:12px;margin-bottom:3px}',
        '.vd-raw{width:100%;box-sizing:border-box;min-height:280px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;line-height:1.5;padding:12px;border:1px solid rgba(17,17,17,.35);background:#F5F3EE;color:#111111;resize:vertical}',
        '.vd-note{padding:10px 16px;background:#F2EFE8;border-top:1px solid #111111;font-size:12px;color:#3D3A35}',
        '.vd-details{border:1px solid rgba(17,17,17,.25);background:#FAF8F4}',
        '.vd-details summary{cursor:pointer;padding:7px 12px;font-family:"Playfair Display",Georgia,serif;font-size:12px;font-weight:700;text-transform:uppercase;background:#F2EFE8}',
        '.vd-details-bd{padding:10px 14px;font-size:12.5px;white-space:pre-wrap;border-top:1px solid rgba(17,17,17,.18)}',
      ].join('\n');
      document.head.appendChild(style);
    }
  }

  function readInputData(container) {
    if (global.RP_DATA && typeof global.RP_DATA === 'object') {
      return global.RP_DATA;
    }
    if (global.VALEROTH_DATA && typeof global.VALEROTH_DATA === 'object') {
      return global.VALEROTH_DATA;
    }
    var jsonScript = document.getElementById('rp-data') || document.getElementById('valeroth-data');
    if (jsonScript && jsonScript.textContent) {
      try {
        return JSON.parse(jsonScript.textContent);
      } catch (e) {}
    }
    if (container && container.getAttribute('data-rp')) {
      try {
        return JSON.parse(container.getAttribute('data-rp'));
      } catch (e2) {}
    }
    return {};
  }

  function findLocationInWorld(locations, query) {
    var t = norm(query);
    if (!t || !Array.isArray(locations)) return null;
    for (var i = 0; i < locations.length; i++) {
      var l = locations[i];
      if (l.id === query || norm(l.name) === t || norm(l.altName) === t) return l;
    }
    for (var j = 0; j < locations.length; j++) {
      var l2 = locations[j];
      if (norm(l2.name).indexOf(t) !== -1 || norm(l2.altName).indexOf(t) !== -1) return l2;
    }
    var best = null;
    var bestLen = 0;
    for (var k = 0; k < locations.length; k++) {
      var l3 = locations[k];
      var n1 = norm(l3.name);
      var n2 = norm(l3.altName);
      var score = Math.max(
        n1 && t.indexOf(n1) !== -1 ? n1.length : 0,
        n2 && t.indexOf(n2) !== -1 ? n2.length : 0
      );
      if (score > bestLen) {
        bestLen = score;
        best = l3;
      }
    }
    return best;
  }


  function normalizeNpcStatus(rawStatus) {
    var s = norm(rawStatus || '');
    if (!s) return 'Còn sống';
    if (
      s.indexOf('chet') !== -1 ||
      s.indexOf('dead') !== -1 ||
      s.indexOf('deceased') !== -1 ||
      s.indexOf('tu vong') !== -1 ||
      s.indexOf('hy sinh') !== -1
    ) {
      return 'Đã chết';
    }
    if (
      s.indexOf('mat tich') !== -1 ||
      s.indexOf('missing') !== -1 ||
      s.indexOf('bien mat') !== -1 ||
      s.indexOf('khong ro') !== -1
    ) {
      return 'Mất tích';
    }
    return 'Còn sống';
  }

  function normalizeNpcs(list) {
    if (!Array.isArray(list)) return [];
    return list
      .map(function (n) {
        if (!n) return null;
        if (typeof n === 'string') {
          return {
            name: n.trim(),
            loc: '',
            role: 'Chưa rõ chức vụ',
            status: 'Còn sống',
          };
        }
        var name = String(n.name || '').trim();
        if (!name) return null;
        return {
          name: name,
          loc: String(n.loc || n.location || '').trim(),
          role: String(n.role || n.title || '').trim() || 'Chưa rõ chức vụ',
          status: normalizeNpcStatus(n.status || n.state || n.condition),
        };
      })
      .filter(Boolean);
  }

  // ============================================================================
  // MODE 1: GENERIC MULTI-WORLD MAP RENDERER (ZERO HARDCODED CHARACTER DATA)
  // ============================================================================

  function resolveWorldForData(raw) {
    var requestedId = String(raw.world || raw.worldId || '').trim();
    if (requestedId) {
      return WORLDS[requestedId] || null;
    }
    // Strict isolation: ONLY auto-pick if EXACTLY 1 world pack script was loaded into this page.
    // Never guess or bleed between multiple worlds!
    var keys = Object.keys(WORLDS);
    if (keys.length === 1) {
      return WORLDS[keys[0]];
    }
    return null;
  }

  function mountMapMode(container, raw) {
    var worldDef = resolveWorldForData(raw);
    if (!worldDef) {
      var reqLabel = raw.world || raw.worldId || '(chưa khai báo world)';
      container.innerHTML =
        '<div class="vd-root"><div class="vd-inner">' +
        '<div class="vd-head"><div>' +
        '<h2 class="vd-title">· CHƯA NẠP GÓI BẢN ĐỒ ·</h2>' +
        '<div class="vd-sub">World yêu cầu: ' +
        esc(reqLabel) +
        '</div></div></div>' +
        '<div class="vd-body"><div class="vd-sec"><div class="vd-sec-bd">' +
        'Nhân vật/thế giới này chưa được nạp tệp <code>worlds/' +
        esc(raw.world || 'ten-the-gioi') +
        '.js</code>. Để tránh lẫn bản đồ giữa các nhân vật khác nhau, lõi <code>engine.js</code> sẽ không tự mở bản đồ của nhân vật khác.' +
        '</div></div></div></div></div>';
      return null;
    }

    var MAP_W = worldDef.width || 1000;
    var MAP_H = worldDef.height || 562;
    var LAYERS = Array.isArray(worldDef.layers) && worldDef.layers.length > 0
      ? worldDef.layers
      : [{ id: 'main', label: worldDef.name || 'Bản đồ', titlePlate: '· ' + (worldDef.name || 'MAP').toUpperCase() + ' ·', image: '' }];
    var LOCATIONS = Array.isArray(worldDef.locations) ? worldDef.locations : [];
    var parentLinks = worldDef.parentLayerLinks || {};

    var defaultLoc =
      findLocationInWorld(LOCATIONS, raw.playerLoc || raw.loc || worldDef.defaultPlayerLoc) ||
      LOCATIONS[0] ||
      null;

    var layerIds = LAYERS.map(function (ly) { return ly.id; });
    var initialScope =
      raw.view && layerIds.indexOf(raw.view) !== -1
        ? raw.view
        : (defaultLoc && layerIds.indexOf(defaultLoc.scope) !== -1 ? defaultLoc.scope : LAYERS[0].id);

    var state = {
      scope: initialScope,
      showZones: true,
      selectedLocId: null,
      playerLoc: defaultLoc,
      status: raw.status || (defaultLoc ? 'Đang có mặt tại ' + defaultLoc.name + '.' : ''),
      chapter: raw.chapter || '',
      npcs: normalizeNpcs(raw.npcs),
    };

    function getLayerImage(layer) {
      if (raw.assets && raw.assets[layer.id]) {
        return raw.assets[layer.id];
      }
      if (raw.assetBaseUrl && layer.assetFile) {
        return raw.assetBaseUrl.replace(/\/+$/, '') + '/' + layer.assetFile;
      }
      return resolveAssetUrl(layer.image, worldDef);
    }

    function mapLocToScope(locObj, scope) {
      if (!locObj) return null;
      if (locObj.scope === scope) return locObj;
      var link = parentLinks[locObj.scope];
      if (link && link.parentScope === scope) {
        return findLocationInWorld(LOCATIONS, link.parentLocId);
      }
      for (var childScope in parentLinks) {
        if (
          Object.prototype.hasOwnProperty.call(parentLinks, childScope) &&
          childScope === scope &&
          parentLinks[childScope].parentLocId === locObj.id &&
          parentLinks[childScope].defaultChildLocId
        ) {
          return findLocationInWorld(LOCATIONS, parentLinks[childScope].defaultChildLocId);
        }
      }
      return null;
    }

    function findChildLayerForLoc(locId) {
      for (var childScope in parentLinks) {
        if (
          Object.prototype.hasOwnProperty.call(parentLinks, childScope) &&
          parentLinks[childScope].parentLocId === locId
        ) {
          return { scope: childScope, label: parentLinks[childScope].enterLabel || 'Vào bên trong →' };
        }
      }
      return null;
    }

    function render() {
      var activeLayer = LAYERS[0];
      for (var li = 0; li < LAYERS.length; li++) {
        if (LAYERS[li].id === state.scope) {
          activeLayer = LAYERS[li];
          break;
        }
      }

      var scopedLocs = LOCATIONS.filter(function (l) { return l.scope === state.scope; });
      var locById = {};
      scopedLocs.forEach(function (l) { locById[l.id] = l; });

      var activePinLoc = mapLocToScope(state.playerLoc, state.scope);
      var titlePlate = activeLayer.titlePlate || ('· ' + activeLayer.label.toUpperCase() + ' ·');

      var npcsByLoc = {};
      state.npcs.forEach(function (npc) {
        if (!npc.loc) return;
        var found = findLocationInWorld(LOCATIONS, npc.loc);
        var mapped = mapLocToScope(found, state.scope);
        if (!mapped || !locById[mapped.id]) return;
        if (!npcsByLoc[mapped.id]) npcsByLoc[mapped.id] = [];
        npcsByLoc[mapped.id].push(npc);
      });

      // 1. Zones
      var zonesSvg = '';
      if (state.showZones) {
        zonesSvg = scopedLocs
          .map(function (loc) {
            if (!loc.zonePath) return '';
            var isPin = activePinLoc && activePinLoc.id === loc.id;
            var isSel = state.selectedLocId === loc.id;
            var isSoft = Boolean(loc.softBlend);
            var fill = isSel || isPin
              ? 'rgba(139,30,30,0.15)'
              : isSoft
              ? 'rgba(17,17,17,0.035)'
              : 'rgba(250,248,244,0.02)';
            var stroke = isSel || isPin ? CRIMSON : INK;
            var halo = isSoft ? 'rgba(250,248,244,0.62)' : 'rgba(250,248,244,0.88)';
            var dash = isSel || isPin ? '10 4' : isSoft ? '2.5 5.5' : '6 4';
            return (
              '<g class="vm-zone" data-loc-id="' + loc.id + '">' +
              '<path class="vm-zone-fill" d="' + loc.zonePath + '" fill="' + fill + '" stroke="' + halo + '" stroke-width="' + (isSel || isPin ? 5 : isSoft ? 2.8 : 3.8) + '" stroke-linejoin="round" />' +
              '<path class="vm-zone-stroke" d="' + loc.zonePath + '" fill="none" stroke="' + stroke + '" stroke-width="' + (isSel || isPin ? 2.2 : isSoft ? 1.15 : 1.35) + '" stroke-dasharray="' + dash + '" stroke-linejoin="round" opacity="' + (isSoft && !isSel && !isPin ? 0.72 : 1) + '" />' +
              '</g>'
            );
          })
          .join('');
      }

      // 2. Banners & User Location Pin ONLY (no routes, no canvas NPC markers, no tags)
      var bannersSvg = scopedLocs
        .map(function (loc) {
          var isPin = activePinLoc && activePinLoc.id === loc.id;
          var isSel = state.selectedLocId === loc.id;
          var borderCol = isPin || isSel ? CRIMSON : INK;
          var titleText = '· ' + loc.name.toUpperCase() + ' ·';
          var bw = Math.max(96, titleText.length * 6.5 + 22);
          var half = bw / 2;

          var pinSvg = isPin
            ? '<g transform="translate(0,-10)">' +
              '<ellipse cx="0" cy="0" rx="18" ry="6.5" fill="none" stroke="' + CRIMSON + '" stroke-width="1.3" stroke-dasharray="3.5 2.5" opacity="0.88" />' +
              '<ellipse cx="0" cy="0" rx="25" ry="9" fill="none" stroke="' + CRIMSON + '" stroke-width="0.7" opacity="0.45" />' +
              '<ellipse cx="0" cy="0.5" rx="6.5" ry="2.3" fill="' + INK + '" opacity="0.28" />' +
              '<path d="M 0 0 C -4.8 -7.2, -11.5 -13.2, -11.5 -20.5 A 11.5 11.5 0 1 1 11.5 -20.5 C 11.5 -13.2, 4.8 -7.2, 0 0 Z" fill="' + PAPER + '" stroke="' + PAPER + '" stroke-width="3.5" stroke-linejoin="round" />' +
              '<path d="M 0 0 C -4.8 -7.2, -11.5 -13.2, -11.5 -20.5 A 11.5 11.5 0 1 1 11.5 -20.5 C 11.5 -13.2, 4.8 -7.2, 0 0 Z" fill="' + CRIMSON + '" stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round" />' +
              '<circle cx="0" cy="-20.5" r="4.3" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="0.95" />' +
              '</g>'
            : '';

          var altSvg = loc.altName
            ? '<g transform="translate(0,22)">' +
              '<rect x="' + (-(loc.altName.length * 3.3 + 9)) + '" y="-8.5" width="' + (loc.altName.length * 6.6 + 18) + '" height="13" fill="rgba(250,248,244,0.92)" />' +
              '<text text-anchor="middle" y="0.8" font-size="8.8" font-style="italic" fill="' + INK_SOFT + '" font-family="Spectral, Georgia, serif">' + esc(loc.altName) + '</text></g>'
            : '';

          return (
            '<g class="vm-zone" data-loc-id="' + loc.id + '" transform="translate(' + loc.x + ',' + loc.y + ')">' +
            '<g transform="translate(0,6)">' +
            '<path d="M ' + (-half + 6) + ' -6 L ' + (-half - 10) + ' -6 L ' + (-half - 4) + ' 2.5 L ' + (-half - 10) + ' 11 L ' + (-half + 6) + ' 11 Z" fill="#EAE5DB" stroke="' + borderCol + '" stroke-width="1.05" />' +
            '<path d="M ' + (half - 6) + ' -6 L ' + (half + 10) + ' -6 L ' + (half + 4) + ' 2.5 L ' + (half + 10) + ' 11 L ' + (half - 6) + ' 11 Z" fill="#EAE5DB" stroke="' + borderCol + '" stroke-width="1.05" />' +
            '<rect x="' + (-half + 2) + '" y="-8" width="' + bw + '" height="23" fill="' + INK + '" opacity="0.2" />' +
            '<rect x="' + (-half) + '" y="-10" width="' + bw + '" height="23" fill="' + PAPER + '" stroke="' + borderCol + '" stroke-width="' + (isPin || isSel ? 1.85 : 1.25) + '" />' +
            '<rect x="' + (-half + 2.5) + '" y="-7.5" width="' + (bw - 5) + '" height="18" fill="none" stroke="' + borderCol + '" stroke-width="0.45" opacity="0.65" />' +
            '<text text-anchor="middle" y="5" font-size="10.2" font-weight="700" fill="' + borderCol + '" font-family="Playfair Display, Spectral, Georgia, serif" letter-spacing="0.4">' + esc(titleText) + '</text>' +
            altSvg +
            '</g>' +
            pinSvg +
            '</g>'
          );
        })
        .join('');

      var selectedObj = state.selectedLocId ? locById[state.selectedLocId] : null;
      var inspectorHtml = '';
      if (selectedObj) {
        var selNpcs = npcsByLoc[selectedObj.id] || [];
        var childInfo = findChildLayerForLoc(selectedObj.id);
        var regionHeading = selectedObj.altName
          ? selectedObj.name + ' (' + selectedObj.altName + ')'
          : selectedObj.name;
        var rulerHtml = selectedObj.ruler
          ? '<div style="margin-bottom:6px;font-size:12px">' +
            '<span style="color:#55524B">Dưới quyền cai quản của:</span> ' +
            '<strong>' + esc(selectedObj.ruler) + '</strong>' +
            '</div>'
          : '';
        var summaryHtml = selectedObj.summary
          ? '<p style="margin:0 0 8px 0;font-size:12px;line-height:1.55;color:#2E2C28">' + esc(selectedObj.summary) + '</p>'
          : '';
        inspectorHtml =
          '<div class="vm-inspector">' +
          '<div class="vm-inspector-hd"><span>' + esc(regionHeading) + '</span><button type="button" data-action="close-insp" class="vm-btn" style="padding:1px 5px">×</button></div>' +
          '<div class="vm-inspector-bd">' +
          rulerHtml +
          summaryHtml +
          (childInfo
            ? '<button type="button" data-action="enter-child" data-target-scope="' + esc(childInfo.scope) + '" class="vm-btn is-active" style="width:100%;justify-content:center;margin-bottom:8px">' + esc(childInfo.label) + '</button>'
            : '') +
          '<div class="vm-insp-npc">' +
          '<div style="font-weight:700;margin-bottom:6px">NPC tại đây:</div>' +
          (selNpcs.length
            ? selNpcs
                .map(function (n) {
                  var modClass = n.status === 'Đã chết' ? ' is-dead' : n.status === 'Mất tích' ? ' is-missing' : '';
                  return (
                    '<div class="vm-npc-callout' + modClass + '">' +
                    '<div class="vm-npc-head">' +
                    '<strong style="color:#111111">' + esc(n.name) + '</strong>' +
                    '<span class="vm-npc-badge' + modClass + '">' + esc(n.status) + '</span>' +
                    '</div>' +
                    '<div class="vm-npc-role">' + esc(n.role) + '</div>' +
                    '</div>'
                  );
                })
                .join('')
            : '<div style="color:#6B665D;font-style:italic">Chưa có dữ liệu</div>') +
          '</div>' +
          '</div></div>';
      }

      var layerTabsHtml = LAYERS.map(function (ly) {
        var hasPlayer = state.playerLoc && state.playerLoc.scope === ly.id;
        return (
          '<button type="button" data-scope="' + esc(ly.id) + '" class="vm-btn ' + (state.scope === ly.id ? 'is-active' : '') + '">' +
          esc(ly.label) +
          (hasPlayer ? ' ●' : '') +
          '</button>'
        );
      }).join('');

      var plateW = Math.max(164, titlePlate.length * 10 + 36);
      var imgSrc = getLayerImage(activeLayer);

      container.innerHTML =
        '<div class="vm-root">' +
        '<div class="vm-bar">' +
        '<div class="vm-tabs">' + layerTabsHtml + '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
        '<button type="button" data-action="toggle-zones" class="vm-btn vm-btn-outline">Khoanh vùng: ' + (state.showZones ? 'Bật' : 'Tắt') + '</button>' +
        '</div>' +
        '</div>' +
        '<div class="vm-stage" style="aspect-ratio:' + MAP_W + '/' + MAP_H + '">' +
        (imgSrc ? '<img class="vm-img" src="' + esc(imgSrc) + '" alt="' + esc(titlePlate) + '" />' : '') +
        '<svg class="vm-svg" viewBox="0 0 ' + MAP_W + ' ' + MAP_H + '">' +
        zonesSvg +
        bannersSvg +
        '<rect x="7" y="7" width="' + (MAP_W - 14) + '" height="' + (MAP_H - 14) + '" fill="none" stroke="' + INK + '" stroke-width="2.2" pointer-events="none" />' +
        '<rect x="12" y="12" width="' + (MAP_W - 24) + '" height="' + (MAP_H - 24) + '" fill="none" stroke="' + INK + '" stroke-width="0.75" pointer-events="none" />' +
        '<g transform="translate(26,24)" pointer-events="none">' +
        '<rect x="2" y="2" width="' + plateW + '" height="36" fill="' + INK + '" opacity="0.16" />' +
        '<rect x="0" y="0" width="' + plateW + '" height="36" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.5" />' +
        '<rect x="3.5" y="3.5" width="' + (plateW - 7) + '" height="29" fill="none" stroke="' + INK + '" stroke-width="0.6" />' +
        '<circle cx="9" cy="9" r="1.2" fill="' + INK + '" /><circle cx="' + (plateW - 9) + '" cy="9" r="1.2" fill="' + INK + '" />' +
        '<circle cx="9" cy="27" r="1.2" fill="' + INK + '" /><circle cx="' + (plateW - 9) + '" cy="27" r="1.2" fill="' + INK + '" />' +
        '<text x="' + (plateW / 2) + '" y="23" text-anchor="middle" font-size="13.5" font-weight="700" fill="' + INK + '" font-family="Playfair Display, Spectral, Georgia, serif" letter-spacing="1.4">' + esc(titlePlate) + '</text></g>' +
        '</svg>' +
        inspectorHtml +
        '</div>' +
        '<div class="vm-foot">' +
        '<div><span class="vm-loc-title">● ' + esc(state.playerLoc ? state.playerLoc.name : (worldDef.name || 'Map')) + '</span>' +
        (state.chapter ? ' <span style="color:#55524B">(' + esc(state.chapter) + ')</span>' : '') +
        (state.status ? ' — ' + esc(state.status) : '') +
        '</div>' +
        '</div>' +
        '</div>';

      // Bindings
      container.querySelectorAll('[data-scope]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          state.scope = btn.getAttribute('data-scope');
          state.selectedLocId = null;
          render();
        });
      });

      container.querySelectorAll('.vm-zone[data-loc-id]').forEach(function (el) {
        el.addEventListener('click', function (ev) {
          ev.stopPropagation();
          state.selectedLocId = el.getAttribute('data-loc-id');
          render();
        });
        el.addEventListener('dblclick', function (ev) {
          ev.stopPropagation();
          var child = findChildLayerForLoc(el.getAttribute('data-loc-id'));
          if (child) {
            state.scope = child.scope;
            state.selectedLocId = null;
            render();
          }
        });
      });

      var closeInsp = container.querySelector('[data-action="close-insp"]');
      if (closeInsp) {
        closeInsp.addEventListener('click', function () {
          state.selectedLocId = null;
          render();
        });
      }

      var enterChild = container.querySelector('[data-action="enter-child"]');
      if (enterChild) {
        enterChild.addEventListener('click', function () {
          state.scope = enterChild.getAttribute('data-target-scope');
          state.selectedLocId = null;
          render();
        });
      }

      var toggleZones = container.querySelector('[data-action="toggle-zones"]');
      if (toggleZones) {
        toggleZones.addEventListener('click', function () {
          state.showZones = !state.showZones;
          render();
        });
      }
    }

    render();

    return {
      addNpc: function (npc) {
        var added = normalizeNpcs([npc]);
        if (added.length) {
          state.npcs.push(added[0]);
          render();
        }
      },
      setPlayerLocation: function (loc, status) {
        var found = findLocationInWorld(LOCATIONS, loc);
        if (!found) return;
        state.playerLoc = found;
        state.scope = found.scope;
        if (status) state.status = status;
        render();
      },
    };
  }

  // ============================================================================
  // MODE 2 & 3: SHARED /recap & /transfer (WORKS FOR EVERY CHARACTER / STORY)
  // ============================================================================

  var RESTORATION_PROTOCOL = [
    'Treat this Transfer Pack as authoritative continuation state, NOT a new story start.',
    '',
    '- RESTORE: Restore the current scene, cumulative event ledger, user profile, chronology, relationships, world state, knowledge boundaries, consequences, and unresolved threads. Never reset established continuity without an established in-world cause.',
    '- CUMULATIVE MEMORY: Use the carried-forward ledger as the continuity record for earlier transfers. Merge it with the current package and new developments. Do not discard early events merely because they are absent from the latest chat\'s recent context.',
    '- PROFILE LOCK: Preserve `{{user}}`\'s established character profile. Do not silently alter defining traits, history, abilities, appearance, voice, preferences, or boundaries. Apply only established development or explicit user-authorized changes.',
    '- EPISTEMIC LOCK: Narrator-level knowledge must not become character knowledge. Preserve sealed information and valid information paths.',
    '- USER AGENCY: The package does not authorize new `{{user}}` behavior. Only new user input establishes new user-controlled actions, dialogue, thoughts, feelings, intentions, reactions, discoveries, decisions, and consent.',
    '- STATE RECONCILIATION: The structured package governs the recorded state. `[LAST RESPONSE]` supplies exact immediate context but does not override established state or fill gaps with invented continuity.',
    '- SEAMLESS RE-ENTRY: Resume directly from `[CURRENT SCENE ANCHOR]`, preserving established style, pacing, characterization, atmosphere, and open interactions. No recap, migration acknowledgment, new opening, or manufactured escalation.',
    '- UNCERTAINTY: Preserve unresolved contradictions and unsupported details. Ask for clarification only when essential.',
    '- NORMAL EXECUTION: Continue under all applicable existing system, world, character, style, causality, knowledge, and agency rules. This package does not override higher-priority instructions.'
  ].join('\n');

  function formatFieldValue(val) {
    if (val === null || val === undefined) return '';
    if (Array.isArray(val)) {
      return val
        .map(function (item) {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object') {
            return Object.keys(item)
              .filter(function (k) { return item[k] !== null && item[k] !== undefined && String(item[k]).trim() !== ''; })
              .map(function (k) { return '- ' + k + ': ' + item[k]; })
              .join('\n');
          }
          return String(item);
        })
        .filter(Boolean)
        .join('\n');
    }
    if (typeof val === 'object') {
      return Object.keys(val)
        .filter(function (k) { return val[k] !== null && val[k] !== undefined && String(val[k]).trim() !== ''; })
        .map(function (k) { return '- ' + k + ': ' + val[k]; })
        .join('\n');
    }
    return String(val).trim();
  }

  function copyTextToClipboard(text, onDone) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { onDone(true); },
        function () { fallbackCopy(text, onDone); }
      );
    } else {
      fallbackCopy(text, onDone);
    }
  }

  function fallbackCopy(text, onDone) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      onDone(Boolean(ok));
    } catch (e) {
      onDone(false);
    }
  }

  function buildRecapMarkdown(raw) {
    var title = raw.title || 'TÓM TẮT DIỄN BIẾN';
    var pairs = [
      ['Current state', raw.currentState],
      ['Character continuity', raw.characterContinuity],
      ['Event history', raw.eventHistory],
      ['Knowledge boundaries', raw.knowledgeBoundaries],
      ['Ongoing threads', raw.ongoingThreads],
      ['Micro-continuity', raw.microContinuity],
      ['Continuity warnings', raw.continuityWarnings],
    ];
    var lines = pairs
      .map(function (p) {
        var v = formatFieldValue(p[1]);
        return v ? '* ' + p[0] + ': ' + v : '';
      })
      .filter(Boolean);
    return '### ' + title + '\n\n```Narrative Summary\n' + lines.join('\n') + '\n```';
  }

  function mountRecapMode(container, raw) {
    var showRaw = false;
    var copied = false;
    var markdownText = buildRecapMarkdown(raw);
    var title = raw.title || 'TÓM TẮT DIỄN BIẾN';

    var sections = [
      { key: 'currentState', label: 'Current State · Trạng thái & Điểm dừng hiện tại', crimson: true },
      { key: 'characterContinuity', label: 'Character Continuity · Nhân vật & Quan hệ' },
      { key: 'eventHistory', label: 'Event History · Chuỗi sự kiện tích lũy' },
      { key: 'knowledgeBoundaries', label: 'Knowledge Boundaries · Ranh giới tri thức' },
      { key: 'ongoingThreads', label: 'Ongoing Threads · Tuyến đang mở & Chờ {{user}}' },
      { key: 'microContinuity', label: 'Micro-Continuity · Chi tiết nhỏ & Lời hứa' },
      { key: 'continuityWarnings', label: 'Continuity Warnings · Cảnh báo & Khoảng trống', crimson: true },
    ];

    function render() {
      var bodyHtml = showRaw
        ? '<textarea class="vd-raw" readonly>' + esc(markdownText) + '</textarea>'
        : sections
            .map(function (s) {
              var val = formatFieldValue(raw[s.key]);
              if (!val) return '';
              return (
                '<div class="vd-sec">' +
                '<div class="vd-sec-hd' + (s.crimson ? ' is-crimson' : '') + '"><span>' + esc(s.label) + '</span></div>' +
                '<div class="vd-sec-bd">' + esc(val) + '</div>' +
                '</div>'
              );
            })
            .join('');

      container.innerHTML =
        '<div class="vd-root"><div class="vd-inner">' +
        '<div class="vd-head">' +
        '<div><h2 class="vd-title">· ' + esc(title) + ' ·</h2>' +
        '<div class="vd-sub">Storyline Recap [HARD_LOCK] · Dùng chung cho mọi nhân vật</div></div>' +
        '<div class="vd-actions">' +
        '<button type="button" data-action="toggle-raw" class="vm-btn vm-btn-outline">' + (showRaw ? 'Xem bản khắc mực' : 'Xem Markdown thô') + '</button>' +
        '<button type="button" data-action="copy-md" class="vm-btn is-active">' + (copied ? '✓ Đã sao chép Markdown' : 'Sao chép Markdown nguyên bản') + '</button>' +
        '</div></div>' +
        '<div class="vd-body">' + bodyHtml + '</div>' +
        '</div></div>';

      var rawBtn = container.querySelector('[data-action="toggle-raw"]');
      if (rawBtn) rawBtn.addEventListener('click', function () { showRaw = !showRaw; render(); });
      var copyBtn = container.querySelector('[data-action="copy-md"]');
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          copyTextToClipboard(markdownText, function (ok) {
            copied = ok;
            render();
            if (ok) setTimeout(function () { copied = false; render(); }, 2000);
          });
        });
      }
    }
    render();
  }

  function buildTransferMarkdown(raw) {
    var parts = ['```Transfer Pack'];
    var meta = raw.metadata;
    if (meta) {
      parts.push('## TRANSFER METADATA');
      if (typeof meta === 'string') {
        parts.push(meta.trim());
      } else {
        if (meta.sequence) parts.push('- Transfer sequence / package version: ' + meta.sequence);
        if (meta.previousRef) parts.push('- Previous Transfer Pack or ledger reference: ' + meta.previousRef);
        if (meta.timelineCoverage) parts.push('- Timeline coverage: ' + meta.timelineCoverage);
        if (meta.gaps) parts.push('- Known history gaps or unresolved discrepancies: ' + meta.gaps);
      }
      parts.push('');
    }

    var textSections = [
      ['## USER CHARACTER PROFILE LOCK', raw.userProfileLock],
      ['## CURRENT TIME, LOCATION & SCENE', raw.currentScene],
      ['## CURRENT CHARACTER & RELATIONSHIP STATES', raw.characterStates],
      ['## WORLD, RESOURCES & ACTIVE PRESSURES', raw.worldPressures],
      ['## KNOWLEDGE & SEALED CONTINUITY', raw.knowledgeSealed],
      ['## MICRO-CONTINUITY', raw.microContinuity],
      ['## ACTIVE THREADS & PENDING COMMITMENTS', raw.activeThreads],
    ];
    textSections.forEach(function (pair) {
      var val = formatFieldValue(pair[1]);
      if (val) { parts.push(pair[0]); parts.push(val); parts.push(''); }
    });

    if (raw.cumulativeLedger) {
      parts.push('## CUMULATIVE TRANSFER LEDGER [HARD_LOCK]');
      if (Array.isArray(raw.cumulativeLedger)) {
        raw.cumulativeLedger.forEach(function (ev) {
          if (typeof ev === 'string') { parts.push('- ' + ev); return; }
          var head = (ev.id ? ev.id : 'EVENT') + (ev.time ? ' / ' + ev.time : '');
          parts.push('- **' + head + '**');
          if (ev.whereWho) parts.push('  - Location & participants: ' + ev.whereWho);
          if (ev.event) parts.push('  - Established event & causal context: ' + ev.event);
          if (ev.changes) parts.push('  - Decisions, discoveries, or changes: ' + ev.changes);
          if (ev.knowledge) parts.push('  - Knowledge updates: ' + ev.knowledge);
          if (ev.consequences) parts.push('  - Persistent consequences & status: ' + ev.consequences);
        });
      } else {
        parts.push(formatFieldValue(raw.cumulativeLedger));
      }
      parts.push('');
    }

    var tailSections = [
      ['## PERSISTENT CONSEQUENCES & CONTINUITY WARNINGS', raw.persistentWarnings],
      ['## CURRENT SCENE ANCHOR', raw.sceneAnchor],
      ['## LAST VALID USER INPUT', raw.lastUserInput],
    ];
    tailSections.forEach(function (pair) {
      var val = formatFieldValue(pair[1]);
      if (val) { parts.push(pair[0]); parts.push(val); parts.push(''); }
    });

    parts.push('---');
    parts.push('');
    parts.push('## NEW CHAT RESTORATION PROTOCOL [ABSOLUTE]');
    parts.push('```Restoration Protocol');
    parts.push(RESTORATION_PROTOCOL);
    parts.push('```');
    parts.push('---');
    parts.push('');
    parts.push('## [LAST RESPONSE]');
    parts.push(formatFieldValue(raw.lastResponse) || 'Unavailable in accessible context.');
    parts.push('');
    parts.push('---');
    parts.push('');
    parts.push('## [USER RESPONSE]');
    parts.push('[Write your next action or dialogue here. This placeholder is not an established action.]');
    parts.push('```');
    return parts.join('\n');
  }

  function mountTransferMode(container, raw) {
    var showRaw = false;
    var copied = false;
    var markdownText = buildTransferMarkdown(raw);

    var orderedSections = [
      { key: 'userProfileLock', label: 'USER CHARACTER PROFILE LOCK · Hồ sơ {{user}}' },
      { key: 'currentScene', label: 'CURRENT TIME, LOCATION & SCENE · Bối cảnh hiện tại', crimson: true },
      { key: 'characterStates', label: 'CURRENT CHARACTER & RELATIONSHIP STATES · Nhân vật & Quan hệ' },
      { key: 'worldPressures', label: 'WORLD, RESOURCES & ACTIVE PRESSURES · Thế giới & Tài nguyên' },
      { key: 'knowledgeSealed', label: 'KNOWLEDGE & SEALED CONTINUITY · Tri thức & Niêm phong' },
      { key: 'microContinuity', label: 'MICRO-CONTINUITY · Chi tiết nhỏ & Lời hứa' },
      { key: 'activeThreads', label: 'ACTIVE THREADS & PENDING COMMITMENTS · Tuyến đang mở' },
    ];

    function renderLedgerHtml() {
      if (!raw.cumulativeLedger) return '';
      if (Array.isArray(raw.cumulativeLedger)) {
        if (!raw.cumulativeLedger.length) return '';
        var items = raw.cumulativeLedger
          .map(function (ev) {
            if (typeof ev === 'string') return '<div class="vd-ledger-item">' + esc(ev) + '</div>';
            var lines = [];
            if (ev.whereWho) lines.push('<strong>Địa điểm & Nhân vật:</strong> ' + esc(ev.whereWho));
            if (ev.event) lines.push('<strong>Sự kiện:</strong> ' + esc(ev.event));
            if (ev.changes) lines.push('<strong>Quyết định / Thay đổi:</strong> ' + esc(ev.changes));
            if (ev.knowledge) lines.push('<strong>Tri thức:</strong> ' + esc(ev.knowledge));
            if (ev.consequences) lines.push('<strong>Hệ quả:</strong> ' + esc(ev.consequences));
            return (
              '<div class="vd-ledger-item">' +
              '<div class="vd-ledger-id">' + esc((ev.id || 'EVENT') + (ev.time ? ' · ' + ev.time : '')) + '</div>' +
              '<div>' + lines.join('<br/>') + '</div></div>'
            );
          })
          .join('');
        return '<div class="vd-sec"><div class="vd-sec-hd"><span>CUMULATIVE TRANSFER LEDGER [HARD_LOCK]</span></div><div class="vd-ledger-list">' + items + '</div></div>';
      }
      var strVal = formatFieldValue(raw.cumulativeLedger);
      return strVal ? '<div class="vd-sec"><div class="vd-sec-hd"><span>CUMULATIVE TRANSFER LEDGER [HARD_LOCK]</span></div><div class="vd-sec-bd">' + esc(strVal) + '</div></div>' : '';
    }

    function render() {
      var bodyHtml = '';
      if (showRaw) {
        bodyHtml = '<textarea class="vd-raw" readonly>' + esc(markdownText) + '</textarea>';
      } else {
        var metaVal = formatFieldValue(raw.metadata);
        var metaHtml = metaVal ? '<div class="vd-sec"><div class="vd-sec-hd"><span>TRANSFER METADATA</span></div><div class="vd-sec-bd">' + esc(metaVal) + '</div></div>' : '';
        var midHtml = orderedSections
          .map(function (s) {
            var val = formatFieldValue(raw[s.key]);
            return val ? '<div class="vd-sec"><div class="vd-sec-hd' + (s.crimson ? ' is-crimson' : '') + '"><span>' + esc(s.label) + '</span></div><div class="vd-sec-bd">' + esc(val) + '</div></div>' : '';
          })
          .join('');
        var ledgerHtml = renderLedgerHtml();
        var tailSpecs = [
          { key: 'persistentWarnings', label: 'PERSISTENT CONSEQUENCES & CONTINUITY WARNINGS', crimson: true },
          { key: 'sceneAnchor', label: 'CURRENT SCENE ANCHOR · Điểm neo tiếp nối', crimson: true },
          { key: 'lastUserInput', label: 'LAST VALID USER INPUT' },
          { key: 'lastResponse', label: '[LAST RESPONSE] · Nguyên văn phản hồi AI liền trước' },
        ];
        var tailHtml = tailSpecs
          .map(function (s) {
            var val = formatFieldValue(raw[s.key]);
            if (!val && s.key !== 'lastResponse') return '';
            return '<div class="vd-sec"><div class="vd-sec-hd' + (s.crimson ? ' is-crimson' : '') + '"><span>' + esc(s.label) + '</span></div><div class="vd-sec-bd">' + esc(val || 'Unavailable in accessible context.') + '</div></div>';
          })
          .join('');
        var protoHtml =
          '<details class="vd-details"><summary>NEW CHAT RESTORATION PROTOCOL [ABSOLUTE] (đã tự nhúng khi sao chép)</summary>' +
          '<div class="vd-details-bd">' + esc(RESTORATION_PROTOCOL) + '</div></details>';
        bodyHtml = metaHtml + midHtml + ledgerHtml + tailHtml + protoHtml;
      }

      container.innerHTML =
        '<div class="vd-root"><div class="vd-inner">' +
        '<div class="vd-head">' +
        '<div><h2 class="vd-title">· NARRATIVE TRANSFER PACK · /TRANSFER ·</h2>' +
        '<div class="vd-sub">Dùng chung cho mọi nhân vật · Tự động đính kèm Restoration Protocol & [USER RESPONSE]</div></div>' +
        '<div class="vd-actions">' +
        '<button type="button" data-action="toggle-raw" class="vm-btn vm-btn-outline">' + (showRaw ? 'Xem bản khắc mực' : 'Xem Markdown thô') + '</button>' +
        '<button type="button" data-action="copy-md" class="vm-btn is-active">' + (copied ? '✓ Đã sao chép Transfer Pack' : 'Sao chép Transfer Pack (New Chat)') + '</button>' +
        '</div></div>' +
        '<div class="vd-body">' + bodyHtml + '</div>' +
        '<div class="vd-note"><strong>Hướng dẫn chuyển sinh:</strong> Bấm nút <strong>Sao chép Transfer Pack (New Chat)</strong> ở góc trên, mở chat mới bằng nút <code>+ (new chat)</code>, dán toàn bộ vào ô nhập, điền tiếp phản hồi của bạn dưới phần <code>[USER RESPONSE]</code> rồi gửi.</div>' +
        '</div></div>';

      var rawBtn = container.querySelector('[data-action="toggle-raw"]');
      if (rawBtn) rawBtn.addEventListener('click', function () { showRaw = !showRaw; render(); });
      var copyBtn = container.querySelector('[data-action="copy-md"]');
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          copyTextToClipboard(markdownText, function (ok) {
            copied = ok;
            render();
            if (ok) setTimeout(function () { copied = false; render(); }, 2200);
          });
        });
      }
    }
    render();
  }

  // Register built-in modes
  MODES.map = mountMapMode;
  MODES.recap = mountRecapMode;
  MODES.transfer = mountTransferMode;
  MODES.chuyensinh = mountTransferMode;

  function findMountTarget(targetSelector) {
    if (typeof targetSelector === 'string') return document.querySelector(targetSelector);
    if (targetSelector) return targetSelector;
    return (
      document.getElementById('rp-app') ||
      document.getElementById('valeroth-app') ||
      document.getElementById('valeroth-map')
    );
  }

  function mountApp(targetSelector, overrideData) {
    ensureStylesAndFonts();
    var container = findMountTarget(targetSelector);
    if (!container) {
      container = document.createElement('div');
      container.id = 'rp-app';
      document.body.appendChild(container);
    }
    var raw = overrideData || readInputData(container);
    var mode = norm(raw.mode || 'map');
    var handler = MODES[mode] || MODES.map;
    return handler(container, raw);
  }

  var api = {
    version: '3.0.0',
    mount: mountApp,
    remount: function () {
      var t = findMountTarget();
      if (t) mountApp(t);
    },
    registerWorld: function (worldDef) {
      if (!worldDef || !worldDef.id) return;
      WORLDS[worldDef.id] = worldDef;
      if (api._booted) api.remount();
    },
    registerMode: function (modeName, renderFn) {
      if (!modeName || typeof renderFn !== 'function') return;
      MODES[norm(modeName)] = renderFn;
      if (api._booted) api.remount();
    },
    WORLDS: WORLDS,
    MODES: MODES,
    _booted: false,
  };

  global.RPEngine = api;
  global.ValerothMap = api; // Legacy alias

  function autoBoot() {
    api._booted = true;
    var target = findMountTarget();
    if (target) mountApp(target);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoBoot);
  } else {
    autoBoot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
