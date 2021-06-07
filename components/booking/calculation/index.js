import React, { useState, useEffect } from "react";
import { Icon } from "antd";

export default ({ data }) => {
  let currencyName = data["currencyName"];
  let numberOfGuestsCount = data["numberOfGuestsCount"];
  let symbol = data['symbol'];
  let price = data["price"];
  let feesForClearing = data["feesForClearing"];
  let feesForStay = price * numberOfGuestsCount;
  let feesForService = ((feesForStay + feesForClearing) * 10) / 100;
  let feesTotal = feesForStay + feesForService + feesForClearing;
  return (
    <div>
      <table className="w-100">
        <tbody>
          <tr>
            <td className="normal-text pt-2">
              {symbol + " "}
              {price} X {numberOfGuestsCount} {numberOfGuestsCount > 1 ? "nights" : "night"}&nbsp;
              <Icon type="info-circle" />
            </td>
            <td className="normal-text pt-2" align="right">
              {symbol + " "}
              {feesForStay}
            </td>
          </tr>
          <tr>
            <td className="normal-text pt-2" >
              Cleaning Fee&nbsp;
              <Icon type="info-circle" />
            </td>
            <td className="normal-text pt-2" align="right">
              {symbol + " "}
              {feesForClearing}
            </td>
          </tr>
          <tr>
            <td className="normal-text pt-2" >
              Service Fee&nbsp;
              <Icon type="info-circle" />
            </td>
            <td className="normal-text pt-2" align="right">
              {symbol + " "}
              {feesForService}
            </td>
          </tr>
        </tbody>

        <tfoot>

          <tr>
            <th width="%" className="sub-title-text pt-2" >Total</th>
            <th className="sub-title-text pt-2" align="right">
              {symbol + " "}
              {feesTotal}
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
