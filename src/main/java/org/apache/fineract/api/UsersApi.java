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
package org.apache.fineract.api;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.fineract.organisation.role.Role;
import org.apache.fineract.organisation.role.RoleRepository;
import org.apache.fineract.organisation.user.AppUser;
import org.apache.fineract.organisation.user.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.apache.fineract.api.AssignmentAction.ASSIGN;

@RestController
@SecurityRequirement(name = "auth")
@RequestMapping("/api/v1")
@Tag(name = "Users API")
public class UsersApi {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AppUserRepository appuserRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping(path = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<AppUser> retrieveAll() {
        return this.appuserRepository.findAll();
    }

    @GetMapping(path = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public AppUser retrieveOne(@PathVariable("userId") Long userId, HttpServletResponse response) {
        AppUser user = appuserRepository.findById(userId).get();
        if(user != null) {
            return user;
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
    }

    @GetMapping(path = "/user/{userId}/roles", produces = MediaType.APPLICATION_JSON_VALUE)
    public Collection<Role> retrieveRoles(@PathVariable("userId") Long userId, HttpServletResponse response) {
        AppUser user = appuserRepository.findById(userId).get();
        if(user != null) {
            return user.getRoles();
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }
    }

    @PostMapping(path = "/user", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void create(@RequestBody AppUser appUser, HttpServletResponse response) {
        AppUser existing = appuserRepository.findAppUserByName(appUser.getUsername());
        if (existing == null) {
            // TODO enforce password policy
            appUser.setId(null);
            appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));
            appuserRepository.saveAndFlush(appUser);
        } else {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
        }
    }

    @PutMapping(path = "/user/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void update(@PathVariable("userId") Long userId, @RequestBody AppUser appUser, HttpServletResponse response) {
        AppUser existing = appuserRepository.findById(userId).get();
        if (existing != null) {
            appUser.setId(userId);
            appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));
            appUser.setRoles(existing.getRoles());
            appuserRepository.saveAndFlush(appUser);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @DeleteMapping(path = "/user/{userId}", produces = MediaType.TEXT_HTML_VALUE)
    public void delete(@PathVariable("userId") Long userId, HttpServletResponse response) {
        if(appuserRepository.findById(userId).isPresent()) {
            appuserRepository.deleteById(userId);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    @PutMapping(path = "/user/{userId}/roles", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void userAssignment(@PathVariable("userId") Long userId, @RequestParam("action") AssignmentAction action,
                               @RequestBody EntityAssignments assignments, HttpServletResponse response) {
        AppUser existingUser = appuserRepository.findById(userId).get();
        if (existingUser != null) {
            Collection<Role> rolesToAssign = existingUser.getRoles();
            List<Long> existingRoleIds = rolesToAssign.stream()
                    .map(Role::getId)
                    .collect(toList());
            List<Role> deltaRoles = assignments.getEntityIds().stream()
                    .filter(id -> {
                        if (ASSIGN.equals(action)) {
                            return !existingRoleIds.contains(id);
                        } else { // revoke
                            return existingRoleIds.contains(id);
                        }
                    })
                    .map(id -> {
                        Role r = roleRepository.findById(id).get();
                        if (r == null) {
                            throw new RuntimeException("Invalid role id: " + id + " can not continue assignment!");
                        } else {
                            return r;
                        }
                    }).collect(toList());

            if (!deltaRoles.isEmpty()) {
                if (ASSIGN.equals(action)) {
                    rolesToAssign.addAll(deltaRoles);
                } else { // revoke
                    rolesToAssign.removeAll(deltaRoles);
                }
                existingUser.setRoles(rolesToAssign);
                appuserRepository.saveAndFlush(existingUser);
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}