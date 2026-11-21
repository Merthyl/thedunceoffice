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
        '.vm-root{font-family:"Spectral",Georgia,serif;color:#111111;background:#EAE6DC;border:1px solid #111111;max-width:1080px;margin:0 auto;box-shadow:4px 4px 0 rgba(17,17,17,.16);user-select:none}',
        '.vm-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;padding:8px 12px;background:#F2EFE8;border-bottom:1px solid #111111}',
        '.vm-tabs{display:inline-flex;border:1px solid #111111;background:#FAF8F4;padding:2px;gap:2px}',
        '.vm-btn{font-family:"Spectral",Georgia,serif;font-size:12px;font-weight:600;border:none;background:transparent;color:#111111;padding:4px 10px;cursor:pointer;display:inline-flex;align-items:center;gap:5px}',
        '.vm-btn:hover{background:#E7E3DA}',
        '.vm-btn.is-active{background:#111111;color:#FAF8F4}',
        '.vm-btn-outline{border:1px solid rgba(17,17,17,.45);background:#FAF8F4}',
        '.vm-btn-crimson{border:1px solid #8B1E1E;color:#8B1E1E;background:#FAF8F4}',
        '.vm-btn-crimson:hover{background:#8B1E1E;color:#FAF8F4}',
        '.vm-stage{position:relative;width:100%;background:#FAF8F4;overflow:hidden}',
        '.vm-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;filter:contrast(1.06)}',
        '.vm-svg{position:relative;z-index:2;width:100%;height:100%;display:block}',
        '.vm-zone{cursor:pointer}',
        '.vm-zone:hover .vm-zone-fill{fill:rgba(17,17,17,.08)}',
        '.vm-zone:hover .vm-zone-stroke{stroke-width:1.9}',
        '.vm-foot{padding:10px 14px;background:#FAF8F4;border-top:1px solid #111111;font-size:12.5px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}',
        '.vm-loc-title{font-family:"Playfair Display","Spectral",Georgia,serif;font-weight:700;letter-spacing:.03em;color:#8B1E1E}',
        '.vm-inspector{position:absolute;top:12px;right:12px;z-index:10;width:276px;max-height:calc(100% - 24px);overflow-y:auto;background:#FAF8F4;border:1px solid #111111;box-shadow:4px 4px 0 rgba(17,17,17,.18);font-size:12px}',
        '.vm-inspector-hd{display:flex;align-items:center;justify-content:space-between;padding:7px 10px;background:#F2EFE8;border-bottom:1px solid #111111;font-family:"Playfair Display",Georgia,serif;font-weight:700;text-transform:uppercase;font-size:12px}',
        '.vm-inspector-bd{padding:10px;line-height:1.5}',
        '.vm-tag-form{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;background:#F5F2EA;border-top:1px solid rgba(17,17,17,.2);align-items:center;font-size:12px}',
        '.vm-input{font-family:"Spectral",Georgia,serif;font-size:12px;padding:4px 8px;border:1px solid rgba(17,17,17,.45);background:#FFFFFF;color:#111111}',
        '.vm-npc-bar{padding:8px 12px;background:#F5F2EA;border-top:1px solid rgba(17,17,17,.22);display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:12px}',
        '.vm-npc-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;background:#FAF8F4;border:1px solid #111111;color:#111111;font-family:"Spectral",Georgia,serif;font-size:11.5px;cursor:pointer}',
        '.vm-npc-chip:hover{background:#E7E3DA}',
        '.vm-npc-chip.is-mentioned{border-style:dashed;color:#3D3A35}',
        '.vm-npc-badge{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;padding:1px 4px;border:1px solid rgba(17,17,17,.35);background:#EFECE4}',
        '.vm-npc-badge.is-custom{border-color:#8B1E1E;color:#8B1E1E;background:#FAF2F0}',
        '.vm-insp-npc{border-top:1px solid rgba(17,17,17,.18);padding-top:6px;margin-top:6px;font-size:11.5px}',
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

  function curvedPath(a, b) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var dist = Math.hypot(dx, dy) || 1;
    var bend = Math.min(20, dist * 0.09);
    var mx = (a.x + b.x) / 2 - (dy / dist) * bend;
    var my = (a.y + b.y) / 2 + (dx / dist) * bend;
    return 'M ' + a.x + ' ' + a.y + ' Q ' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + b.x + ' ' + b.y;
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
            role: '',
            status: '',
            source: 'custom',
            visibility: 'mentioned',
          };
        }
        var name = String(n.name || '').trim();
        if (!name) return null;
        var vis = norm(n.visibility || n.seen || 'encountered');
        var isMentioned = vis === 'mentioned' || vis === 'nhac den' || vis === 'rumored';
        var src = norm(n.source || n.origin || 'canon');
        var isCustom = src === 'custom' || src === 'new' || src === 'user' || src === 'tao moi';
        return {
          name: name,
          loc: String(n.loc || n.location || '').trim(),
          role: String(n.role || '').trim(),
          status: String(n.status || '').trim(),
          source: isCustom ? 'custom' : 'canon',
          visibility: isMentioned ? 'mentioned' : 'encountered',
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
    var ROUTES = Array.isArray(worldDef.routes) ? worldDef.routes : [];
    var parentLinks = worldDef.parentLayerLinks || {};

    var defaultLoc =
      findLocationInWorld(LOCATIONS, raw.playerLoc || raw.loc || worldDef.defaultPlayerLoc) ||
      LOCATIONS[0] ||
      null;
    var fromLocObj = raw.fromLoc || raw.from ? findLocationInWorld(LOCATIONS, raw.fromLoc || raw.from) : null;

    var layerIds = LAYERS.map(function (ly) { return ly.id; });
    var initialScope =
      raw.view && layerIds.indexOf(raw.view) !== -1
        ? raw.view
        : (defaultLoc && layerIds.indexOf(defaultLoc.scope) !== -1 ? defaultLoc.scope : LAYERS[0].id);

    var state = {
      scope: initialScope,
      showZones: true,
      showRoutes: true,
      showNpcs: true,
      selectedLocId: null,
      showTagBar: Boolean(raw.enableTagEditor),
      playerLoc: defaultLoc,
      fromLoc: fromLocObj,
      status: raw.status || (defaultLoc ? 'Đang có mặt tại ' + defaultLoc.name + '.' : ''),
      chapter: raw.chapter || '',
      tags: Array.isArray(raw.tags) ? raw.tags.slice() : [],
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
      // Check if locObj's layer is nested inside a parent location on `scope`
      var link = parentLinks[locObj.scope];
      if (link && link.parentScope === scope) {
        return findLocationInWorld(LOCATIONS, link.parentLocId);
      }
      // Or if user stands on parentLocId and switches into child layer
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
      var scopedRoutes = ROUTES.filter(function (r) { return r.scope === state.scope; });
      var locById = {};
      scopedLocs.forEach(function (l) { locById[l.id] = l; });

      var activePinLoc = mapLocToScope(state.playerLoc, state.scope);
      var titlePlate = activeLayer.titlePlate || ('· ' + activeLayer.label.toUpperCase() + ' ·');

      var tagsByLoc = {};
      state.tags.forEach(function (t) {
        if (!t || !t.label) return;
        var resolved = findLocationInWorld(LOCATIONS, t.loc || t.location || '');
        if (!resolved || !locById[resolved.id]) return;
        if (!tagsByLoc[resolved.id]) tagsByLoc[resolved.id] = [];
        tagsByLoc[resolved.id].push({
          label: String(t.label).trim(),
          tone: t.tone === 'crimson' ? 'crimson' : 'ink',
        });
      });

      var npcsByLoc = {};
      if (state.showNpcs) {
        state.npcs.forEach(function (npc) {
          if (!npc.loc) return;
          var found = findLocationInWorld(LOCATIONS, npc.loc);
          var mapped = mapLocToScope(found, state.scope);
          if (!mapped || !locById[mapped.id]) return;
          if (!npcsByLoc[mapped.id]) npcsByLoc[mapped.id] = [];
          npcsByLoc[mapped.id].push(npc);
        });
      }

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

      // 2. Routes
      var routesSvg = '';
      if (state.showRoutes) {
        routesSvg = scopedRoutes
          .map(function (r) {
            var a = locById[r.from];
            var b = locById[r.to];
            if (!a || !b) return '';
            var isTrav =
              state.fromLoc &&
              activePinLoc &&
              ((r.from === state.fromLoc.id && r.to === activePinLoc.id) ||
                (r.to === state.fromLoc.id && r.from === activePinLoc.id));
            var d = curvedPath(a, b);
            var dash = r.type === 'secret' ? '2 4' : r.type === 'portal' ? '6 3 2 3' : '5 4';
            return (
              (isTrav
                ? '<path d="' + d + '" fill="none" stroke="rgba(250,248,244,0.9)" stroke-width="4.2" stroke-linecap="round" />'
                : '') +
              '<path d="' + d + '" fill="none" stroke="' + (isTrav ? CRIMSON : INK) + '" stroke-width="' + (isTrav ? 2.1 : 1.05) + '" ' +
              (isTrav ? '' : 'stroke-dasharray="' + dash + '"') +
              ' opacity="' + (isTrav ? 0.94 : 0.4) + '" stroke-linecap="round" />'
            );
          })
          .join('');
      }

      // 3. Banners, Pin, Tags & Encountered/Mentioned NPCs
      var bannersSvg = scopedLocs
        .map(function (loc) {
          var isPin = activePinLoc && activePinLoc.id === loc.id;
          var isSel = state.selectedLocId === loc.id;
          var borderCol = isPin || isSel ? CRIMSON : INK;
          var titleText = '· ' + loc.name.toUpperCase() + ' ·';
          var bw = Math.max(96, titleText.length * 6.5 + 22);
          var half = bw / 2;
          var locTags = tagsByLoc[loc.id] || [];
          var locNpcs = npcsByLoc[loc.id] || [];

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

          var tagSvg = '';
          if (locTags.length > 0) {
            var joined = locTags.slice(0, 2).map(function (t) { return t.label; }).join(' · ');
            if (locTags.length > 2) joined += ' +' + (locTags.length - 2);
            var tw = Math.min(188, joined.length * 6.1 + 22);
            var hasCrimson = locTags.some(function (t) { return t.tone === 'crimson'; });
            var ty = isPin ? -48 : -16;
            tagSvg =
              '<g transform="translate(0,' + ty + ')">' +
              '<rect x="' + (-tw / 2) + '" y="-8.5" width="' + tw + '" height="16.5" fill="' + (hasCrimson ? CRIMSON : INK) + '" stroke="' + PAPER + '" stroke-width="0.9" />' +
              '<text text-anchor="middle" y="2.8" font-size="8.6" font-weight="600" fill="' + PAPER + '" font-family="Spectral, Georgia, serif">' + esc(joined) + '</text></g>';
          }

          var npcSvg = '';
          if (locNpcs.length > 0) {
            var hasEnc = locNpcs.some(function (n) { return n.visibility === 'encountered'; });
            var npcText = '◈ ' + locNpcs.slice(0, 2).map(function (n) { return n.name; }).join(', ');
            if (locNpcs.length > 2) npcText += ' +' + (locNpcs.length - 2);
            var nw = Math.min(205, npcText.length * 5.6 + 22);
            var ny = loc.altName ? 38 : 26;
            npcSvg =
              '<g transform="translate(0,' + ny + ')">' +
              '<rect x="' + (-nw / 2) + '" y="-8" width="' + nw + '" height="15.5" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="' + (hasEnc ? 1.15 : 0.95) + '" ' + (hasEnc ? '' : 'stroke-dasharray="3 2.5"') + ' />' +
              '<text text-anchor="middle" y="2.5" font-size="8.4" font-weight="' + (hasEnc ? 700 : 600) + '" fill="' + (hasEnc ? INK : INK_SOFT) + '" font-family="Spectral, Georgia, serif">' + esc(npcText) + '</text></g>';
          }

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
            npcSvg +
            '</g>' +
            pinSvg +
            tagSvg +
            '</g>'
          );
        })
        .join('');

      var selectedObj = state.selectedLocId ? locById[state.selectedLocId] : null;
      var inspectorHtml = '';
      if (selectedObj) {
        var selTags = tagsByLoc[selectedObj.id] || [];
        var selNpcs = npcsByLoc[selectedObj.id] || [];
        var childInfo = findChildLayerForLoc(selectedObj.id);
        inspectorHtml =
          '<div class="vm-inspector">' +
          '<div class="vm-inspector-hd"><span>· ' + esc(selectedObj.name) + ' ·</span><button type="button" data-action="close-insp" class="vm-btn" style="padding:1px 5px">×</button></div>' +
          '<div class="vm-inspector-bd">' +
          (selectedObj.ruler ? '<div style="color:#55524B;font-size:11px;margin-bottom:6px"><strong>' + esc(selectedObj.ruler) + '</strong></div>' : '') +
          (selectedObj.summary ? '<p style="margin:0 0 8px">' + esc(selectedObj.summary) + '</p>' : '') +
          (selNpcs.length
            ? '<div class="vm-insp-npc" style="margin-bottom:8px">' +
              '<div style="font-weight:700;margin-bottom:4px">NPC tại đây (' + selNpcs.length + '):</div>' +
              selNpcs
                .map(function (n) {
                  return (
                    '<div style="margin-bottom:5px;padding-left:6px;border-left:2px solid ' + (n.visibility === 'encountered' ? INK : '#888379') + '">' +
                    '<strong>' + esc(n.name) + '</strong> ' +
                    '<span class="vm-npc-badge">' + (n.visibility === 'encountered' ? 'Chạm trán' : 'Nhắc đến') + '</span>' +
                    (n.source === 'custom' ? ' <span class="vm-npc-badge is-custom">Tạo mới</span>' : '') +
                    (n.role ? '<div style="color:#55524B;font-size:10.5px">' + esc(n.role) + '</div>' : '') +
                    (n.status ? '<div style="font-style:italic;font-size:11px">' + esc(n.status) + '</div>' : '') +
                    '</div>'
                  );
                })
                .join('') +
              '</div>'
            : '') +
          (selTags.length
            ? '<div style="margin-bottom:8px;font-size:11px"><strong>Tag:</strong> ' + selTags.map(function (t) { return esc(t.label); }).join(' · ') + '</div>'
            : '') +
          (childInfo
            ? '<button type="button" data-action="enter-child" data-target-scope="' + esc(childInfo.scope) + '" class="vm-btn is-active" style="width:100%;justify-content:center;margin-bottom:6px">' + esc(childInfo.label) + '</button>'
            : '') +
          '<button type="button" data-action="pin-here" data-id="' + selectedObj.id + '" class="vm-btn vm-btn-crimson" style="width:100%;justify-content:center">Đặt dấu vị trí tại đây</button>' +
          '</div></div>';
      }

      var tagBarHtml = '';
      if (state.showTagBar) {
        var options = scopedLocs.map(function (l) {
          return '<option value="' + l.id + '">' + esc(l.name) + '</option>';
        }).join('');
        tagBarHtml =
          '<form class="vm-tag-form" data-action="add-tag-form">' +
          '<select class="vm-input" name="kind">' +
          '<option value="npc-enc">NPC (Chạm trán)</option>' +
          '<option value="npc-men">NPC (Nhắc đến)</option>' +
          '<option value="tag-ink">Tag (Mực đen)</option>' +
          '<option value="tag-crimson">Tag (Đỏ sẫm)</option>' +
          '</select>' +
          '<select class="vm-input" name="loc">' + options + '</select>' +
          '<input class="vm-input" name="label" placeholder="Tên NPC (có sẵn / mới) hoặc sự kiện..." style="flex:1;min-width:150px" />' +
          '<input class="vm-input" name="role" placeholder="Vai trò / ghi chú ngắn (tùy chọn)..." style="width:165px" />' +
          '<button type="submit" class="vm-btn is-active">Thêm lên bản đồ</button>' +
          '</form>';
      }

      var npcRosterHtml = '';
      if (state.showNpcs && state.npcs.length > 0) {
        npcRosterHtml =
          '<div class="vm-npc-bar">' +
          '<strong style="font-family:Playfair Display,Georgia,serif;font-size:11.5px;text-transform:uppercase;letter-spacing:.03em">NPC hiện diện / nhắc đến:</strong>' +
          state.npcs
            .map(function (n, idx) {
              var resolved = n.loc ? findLocationInWorld(LOCATIONS, n.loc) : null;
              var locLabel = resolved ? ' · ' + resolved.name : '';
              return (
                '<button type="button" class="vm-npc-chip ' + (n.visibility === 'mentioned' ? 'is-mentioned' : '') + '" data-npc-idx="' + idx + '" title="' + esc((n.role ? n.role + ' — ' : '') + (n.status || 'Bấm để xem vị trí')) + '">' +
                '<span>◈ ' + esc(n.name) + '</span>' +
                '<span class="vm-npc-badge">' + (n.visibility === 'encountered' ? 'Chạm trán' : 'Nhắc đến') + '</span>' +
                (n.source === 'custom' ? '<span class="vm-npc-badge is-custom">Mới</span>' : '') +
                (locLabel ? '<span style="color:#55524B;font-size:10.5px">' + esc(locLabel) + '</span>' : '') +
                '</button>'
              );
            })
            .join('') +
          '</div>';
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
        '<button type="button" data-action="toggle-routes" class="vm-btn vm-btn-outline">Tuyến: ' + (state.showRoutes ? 'Bật' : 'Tắt') + '</button>' +
        (state.npcs.length > 0
          ? '<button type="button" data-action="toggle-npcs" class="vm-btn vm-btn-outline">NPC (' + state.npcs.length + '): ' + (state.showNpcs ? 'Hiện' : 'Ẩn') + '</button>'
          : '') +
        '<button type="button" data-action="toggle-tagbar" class="vm-btn vm-btn-outline">' + (state.showTagBar ? 'Ẩn gắn tag / NPC' : '+ Gắn tag / NPC') + '</button>' +
        '</div>' +
        '</div>' +
        '<div class="vm-stage" style="aspect-ratio:' + MAP_W + '/' + MAP_H + '">' +
        (imgSrc ? '<img class="vm-img" src="' + esc(imgSrc) + '" alt="' + esc(titlePlate) + '" />' : '') +
        '<svg class="vm-svg" viewBox="0 0 ' + MAP_W + ' ' + MAP_H + '">' +
        zonesSvg +
        routesSvg +
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
        npcRosterHtml +
        tagBarHtml +
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

      var pinHere = container.querySelector('[data-action="pin-here"]');
      if (pinHere) {
        pinHere.addEventListener('click', function () {
          var nextLoc = findLocationInWorld(LOCATIONS, pinHere.getAttribute('data-id'));
          if (nextLoc) {
            state.fromLoc = state.playerLoc;
            state.playerLoc = nextLoc;
            state.status = 'Đang có mặt tại ' + nextLoc.name + '.';
            state.selectedLocId = null;
            render();
          }
        });
      }

      var toggleZones = container.querySelector('[data-action="toggle-zones"]');
      if (toggleZones) {
        toggleZones.addEventListener('click', function () {
          state.showZones = !state.showZones;
          render();
        });
      }

      var toggleRoutes = container.querySelector('[data-action="toggle-routes"]');
      if (toggleRoutes) {
        toggleRoutes.addEventListener('click', function () {
          state.showRoutes = !state.showRoutes;
          render();
        });
      }

      var toggleNpcs = container.querySelector('[data-action="toggle-npcs"]');
      if (toggleNpcs) {
        toggleNpcs.addEventListener('click', function () {
          state.showNpcs = !state.showNpcs;
          render();
        });
      }

      container.querySelectorAll('[data-npc-idx]').forEach(function (chip) {
        chip.addEventListener('click', function () {
          var idx = Number(chip.getAttribute('data-npc-idx'));
          var npc = state.npcs[idx];
          if (!npc || !npc.loc) return;
          var resolved = findLocationInWorld(LOCATIONS, npc.loc);
          if (resolved) {
            state.scope = resolved.scope;
            state.selectedLocId = resolved.id;
            render();
          }
        });
      });

      var toggleTagBar = container.querySelector('[data-action="toggle-tagbar"]');
      if (toggleTagBar) {
        toggleTagBar.addEventListener('click', function () {
          state.showTagBar = !state.showTagBar;
          render();
        });
      }

      var tagForm = container.querySelector('[data-action="add-tag-form"]');
      if (tagForm) {
        tagForm.addEventListener('submit', function (ev) {
          ev.preventDefault();
          var kindVal = tagForm.querySelector('[name="kind"]').value;
          var locVal = tagForm.querySelector('[name="loc"]').value;
          var labelVal = tagForm.querySelector('[name="label"]').value.trim();
          var roleVal = (tagForm.querySelector('[name="role"]').value || '').trim();
          if (!labelVal) return;
          if (kindVal === 'npc-enc' || kindVal === 'npc-men') {
            state.npcs.push({
              name: labelVal,
              loc: locVal,
              role: roleVal,
              status: '',
              source: 'custom',
              visibility: kindVal === 'npc-enc' ? 'encountered' : 'mentioned',
            });
            state.showNpcs = true;
          } else {
            state.tags.push({
              loc: locVal,
              label: labelVal,
              tone: kindVal === 'tag-crimson' ? 'crimson' : 'ink',
            });
          }
          render();
        });
      }
    }

    render();

    return {
      addTag: function (loc, label, tone) {
        state.tags.push({ loc: loc, label: label, tone: tone || 'ink' });
        render();
      },
      addNpc: function (npc) {
        var added = normalizeNpcs([npc]);
        if (added.length) {
          state.npcs.push(added[0]);
          state.showNpcs = true;
          render();
        }
      },
      setPlayerLocation: function (loc, status) {
        var found = findLocationInWorld(LOCATIONS, loc);
        if (!found) return;
        state.fromLoc = state.playerLoc;
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
