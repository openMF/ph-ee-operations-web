/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.apache.fineract.organisation.user;

import org.apache.fineract.organisation.office.OfficeData;
import org.apache.fineract.organisation.role.RoleData;
import org.apache.fineract.organisation.staff.StaffData;

import java.util.Collection;
import java.util.Objects;


public class AppUserData {

    private Long id;
    private String username;
    private Long officeId;
    private String officeName;
    private String firstname;
    private String lastname;
    private String email;
    private Boolean passwordNeverExpires;
    private Collection<OfficeData> allowedOffices;
    private Collection<RoleData> availableRoles;
    private Collection<RoleData> selectedRoles;
    private StaffData staff;

    public AppUserData() {}
    
    public AppUserData(Long id, String username, Long officeId, String officeName, String firstname, String lastname, String email, Boolean passwordNeverExpires, Collection<OfficeData> allowedOffices, Collection<RoleData> availableRoles, Collection<RoleData> selectedRoles, StaffData staff) {
        this.id = id;
        this.username = username;
        this.officeId = officeId;
        this.officeName = officeName;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.passwordNeverExpires = passwordNeverExpires;
        this.allowedOffices = allowedOffices;
        this.availableRoles = availableRoles;
        this.selectedRoles = selectedRoles;
        this.staff = staff;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public String getOfficeName() {
        return officeName;
    }

    public void setOfficeName(String officeName) {
        this.officeName = officeName;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Boolean getPasswordNeverExpires() {
        return passwordNeverExpires;
    }

    public void setPasswordNeverExpires(Boolean passwordNeverExpires) {
        this.passwordNeverExpires = passwordNeverExpires;
    }

    public Collection<OfficeData> getAllowedOffices() {
        return allowedOffices;
    }

    public void setAllowedOffices(Collection<OfficeData> allowedOffices) {
        this.allowedOffices = allowedOffices;
    }

    public Collection<RoleData> getAvailableRoles() {
        return availableRoles;
    }

    public void setAvailableRoles(Collection<RoleData> availableRoles) {
        this.availableRoles = availableRoles;
    }

    public Collection<RoleData> getSelectedRoles() {
        return selectedRoles;
    }

    public void setSelectedRoles(Collection<RoleData> selectedRoles) {
        this.selectedRoles = selectedRoles;
    }

    public StaffData getStaff() {
        return staff;
    }

    public void setStaff(StaffData staff) {
        this.staff = staff;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AppUserData that = (AppUserData) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(username, that.username) &&
                Objects.equals(officeId, that.officeId) &&
                Objects.equals(officeName, that.officeName) &&
                Objects.equals(firstname, that.firstname) &&
                Objects.equals(lastname, that.lastname) &&
                Objects.equals(email, that.email) &&
                Objects.equals(passwordNeverExpires, that.passwordNeverExpires) &&
                Objects.equals(allowedOffices, that.allowedOffices) &&
                Objects.equals(availableRoles, that.availableRoles) &&
                Objects.equals(selectedRoles, that.selectedRoles) &&
                Objects.equals(staff, that.staff);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, officeId, officeName, firstname, lastname, email, passwordNeverExpires, allowedOffices, availableRoles, selectedRoles, staff);
    }
}