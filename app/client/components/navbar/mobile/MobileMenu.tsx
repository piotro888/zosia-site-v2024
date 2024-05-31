import {
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
} from "@headlessui/react";
import React, { useContext } from "react";
import { Divider } from "./Divider";
import { SideNavLink } from "./SideNavLink";
import { Context, reverse } from "@reactivated";
import {
  Bars3Icon,
  ArrowRightEndOnRectangleIcon,
  UserPlusIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ClockIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
  LockClosedIcon,
  PuzzlePieceIcon,
  HomeModernIcon,
} from "@heroicons/react/24/outline";

const ICON_SIZE = 6;

export const MobileMenu = () => {
  const context = useContext(Context);

  return (
    <Popover className="absolute left-0 lg:hidden">
      <PopoverButton className="btn btn-ghost btn-circle">
        <Bars3Icon className="size-6" />
      </PopoverButton>
      <PopoverOverlay className="fixed inset-0 bg-black/50" />
      <PopoverPanel className="bg-base-100 fixed left-0 top-0 h-full overflow-scroll">
        {context.is_authenticated ? (
          <>
            <SideNavLink to={reverse("accounts_profile")}>
              <UserCircleIcon className={`size-${ICON_SIZE}`} />
              {context.first_name} {context.last_name}
            </SideNavLink>
            <SideNavLink to={reverse("logout")}>
              <ArrowRightStartOnRectangleIcon className={`size-${ICON_SIZE}`} />
              Log out
            </SideNavLink>
          </>
        ) : (
          <>
            <SideNavLink to={reverse("login")}>
              <ArrowRightEndOnRectangleIcon className={`size-${ICON_SIZE}`} />
              Log in
            </SideNavLink>
            <SideNavLink to={reverse("accounts_signup")}>
              <UserPlusIcon className={`size-${ICON_SIZE}`} />
              Sign up
            </SideNavLink>
          </>
        )}
        <Divider />
        {context.is_staff && (
          <>
            <SideNavLink to={reverse("admin")}>
              <LockClosedIcon className={`size-${ICON_SIZE}`} />
              Admin
            </SideNavLink>
            <Divider />
          </>
        )}
        {context.is_authenticated && (
          <>
            <SideNavLink to={reverse("rooms_index")}>
              <HomeModernIcon className={`size-${ICON_SIZE}`} />
              Rooms
            </SideNavLink>
            <SideNavLink to={reverse("boardgames_index")}>
              <PuzzlePieceIcon className={`size-${ICON_SIZE}`} />
              Boardgames
            </SideNavLink>
            <Divider />
          </>
        )}
        <SideNavLink to={reverse("blog_index")}>
          <InformationCircleIcon className={`size-${ICON_SIZE}`} />
          Blog
        </SideNavLink>
        <SideNavLink to={reverse("questions_index")}>
          <QuestionMarkCircleIcon className={`size-${ICON_SIZE}`} />
          Q&A
        </SideNavLink>
        <SideNavLink to={reverse("lectures_index")}>
          <BookOpenIcon className={`size-${ICON_SIZE}`} />
          Lectures
        </SideNavLink>
        <SideNavLink to={reverse("lectures_schedule")}>
          <ClockIcon className={`size-${ICON_SIZE}`} />
          Schedule
        </SideNavLink>
      </PopoverPanel>
    </Popover>
  );
};
