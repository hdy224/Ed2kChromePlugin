// Generated by CoffeeScript 1.3.3
(function() {
  var check_selected, checked, cleanScope, cleanSearch, cleanSelect, confirmCopy, confirmScope, contabid, dealBig, dealChecked, dealEd2k, maxid, result, scanColor, selectAll, selectOpposite, selectedIDS, table, toggle_check, trs, wrap_tr;

  contabid = 0;

  maxid = 0;

  result = [];

  table = {};

  trs = "";

  selectedIDS = {};

  $(document).ready(function() {
    var data_map;
    result = chrome.extension.getBackgroundPage().result;
    result = dealEd2k(result);
    table = $("#table");
    trs = wrap_tr(result);
    table.append(trs);
    $("span[i18n]").each(function() {
      return $(this).html(chrome.i18n.getMessage($(this).attr('i18n')));
    });
    $("input[i18n]").each(function() {
      return $(this).val(chrome.i18n.getMessage($(this).attr('i18n')));
    });
    data_map = {
      "confirmScope": confirmScope,
      "cleanSearch": cleanSearch,
      "cleanScope": cleanScope,
      "selectAll": selectAll,
      "selectOpposite": selectOpposite,
      "cleanSelect": cleanSelect,
      "confirmCopy": confirmCopy
    };
    $("input[data-map]").live("click", function() {
      data_map[$(this).attr("data-map")]();
    });
    $("#searchText").live("keyup", function() {
      var key, r, st, templinkobj, temptrtd;
      check_selected();
      st = $(this).val();
      templinkobj = {};
      for (key in result) {
        r = result[key];
        if (key.toLocaleLowerCase().indexOf(st.toLocaleLowerCase()) > -1) {
          templinkobj[key] = r;
        }
      }
      temptrtd = wrap_tr(templinkobj);
      table.find("tbody").remove();
      table.append(temptrtd);
      return check_selected();
    });
    return table.delegate("td[ee]", "click", function() {
      dealChecked($(this));
      return scanColor();
    }).delegate("tr", "mouseenter", function() {
      $(this).css("cursor", "pointer");
      return $(this).addClass("selected_tr");
    }).delegate("tr", "mouseout", function() {
      var cb;
      cb = $(this).find("input[type='checkbox']");
      if (!checked(cb)) {
        return $(this).removeClass("selected_tr");
      }
    });
  });

  dealEd2k = function(linkarr) {
    var count, link, name, re, regex2, tmp, _i, _len;
    re = {};
    count = 0;
    for (_i = 0, _len = linkarr.length; _i < _len; _i++) {
      link = linkarr[_i];
      regex2 = /ed2k:\/\/\|file\|(.+?)\|(.+?)\|.+?\//ig;
      tmp = regex2.exec(link);
      if (!tmp) {
        continue;
      }
      name = decodeURI(tmp[1]);
      if (re[name] != null) {
        continue;
      }
      count++;
      re[name] = {
        id: count,
        link: tmp[0],
        big: tmp[2] / (1024 * 1024)
      };
    }
    maxid = count;
    return re;
  };

  wrap_tr = function(linkobj) {
    var key, obj, tr, trtd;
    trtd = $("<tbody></tobdy>");
    for (key in linkobj) {
      obj = linkobj[key];
      tr = $("<tr id=\"tr_" + obj.id + "\"></tr>");
      tr.append("<td><input type=\"checkbox\" id=\"cb_" + obj.id + "\" ed2k=\"" + obj.link + "\" /></td>");
      tr.append("<td ee=\"ee\">" + obj.id + "</td>");
      tr.append("<td ee=\"ee\" style=\"max-width:470px;overflow-x:hidden;word-brek:keep-all;\">" + key + "</td>");
      tr.append("<td ee=\"ee\">" + (dealBig(obj.big)) + "</td>");
      trtd.append(tr);
    }
    return trtd;
  };

  dealBig = function(num) {
    var numstr;
    num = num.toFixed(3);
    numstr = "";
    if (num < 1) {
      numstr = "" + (num * 1000) + "KB";
    } else if (num >= 1 && num < 10) {
      numstr = "" + (Math.round(num * 10) / 10) + "MB";
    } else {
      numstr = "" + (Math.floor(num)) + "MB";
    }
    return numstr;
  };

  check_selected = function() {
    return $("input[type='checkbox']").each(function() {
      var id, key, selected_id, temp, _results;
      if (checked($(this))) {
        id = $(this).attr("id");
        id = id.substring(3, id.length);
        selectedIDS[id] = 0;
      }
      _results = [];
      for (key in selectedIDS) {
        selected_id = selectedIDS[key];
        temp = $("#cb_" + key);
        if (temp != null) {
          _results.push(temp.attr("checked", true));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    });
  };

  dealChecked = function(td) {
    var cb;
    cb = td.siblings("td").find("input[type='checkbox']");
    return toggle_check(cb);
  };

  scanColor = function() {
    return $("tr").each(function() {
      var cb;
      cb = $(this).find("input[type='checkbox']");
      if (checked(cb)) {
        return $(this).addClass("selected_tr");
      } else {
        return $(this).removeClass("selected_tr");
      }
    });
  };

  confirmScope = function() {
    var from, i, reg, to, _i;
    from = Math.floor($("#from").val());
    to = Math.floor($("#to").val());
    reg = /\d+/;
    if (!(reg.test(from) && reg.test(to)) || (from <= 0 || to <= 0) || from > to) {
      alert("范围输入有问题，请输入正确数字");
      return false;
    }
    if (to > maxid) {
      alert("最大范围超出有效选项数，请输入正确数字");
      return false;
    }
    for (i = _i = from; from <= to ? _i <= to : _i >= to; i = from <= to ? ++_i : --_i) {
      selectedIDS[i] = 0;
    }
    check_selected();
    scanColor();
    return true;
  };

  cleanScope = function() {
    $("#from").val("");
    return $("#to").val("");
  };

  selectAll = function() {
    $("input[type='checkbox']").each(function() {
      return $(this).attr('checked', true);
    });
    return scanColor();
  };

  selectOpposite = function() {
    $("input[type='checkbox']").each(function() {
      return toggle_check($(this));
    });
    return scanColor();
  };

  cleanSearch = function() {
    check_selected();
    $("#searchText").val("");
    table.find("tbody").remove();
    table.append(trs);
    check_selected();
    return scanColor();
  };

  cleanSelect = function() {
    $("input[type='checkbox']").each(function() {
      if ($(this).attr('checked') === "checked") {
        return $(this).attr("checked", false);
      }
    });
    scanColor();
    return selectedIDS = {};
  };

  confirmCopy = function() {
    var count, cpresult;
    cpresult = "";
    count = 0;
    $("input[type='checkbox']").each(function() {
      if ($(this).attr("checked") === "checked") {
        cpresult += "" + ($(this).attr("ed2k")) + "\n";
        return count++;
      }
    });
    if (count === 0) {
      alert(chrome.i18n.getMessage("eroor_unselected"));
      return false;
    }
    return chrome.extension.sendRequest({
      ask: "createCopy",
      result: cpresult
    }, function(response) {});
  };

  checked = function(element) {
    return element.attr("checked") === "checked";
  };

  toggle_check = function(checkbox) {
    if (checked(checkbox)) {
      return checkbox.attr("checked", false);
    } else {
      return checkbox.attr("checked", true);
    }
  };

}).call(this);
